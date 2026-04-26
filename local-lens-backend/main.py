from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
from textblob import TextBlob
from sklearn.cluster import DBSCAN
import numpy as np
import random
import json
import os
from collections import Counter

# ==========================================
# 1. AI MODEL INITIALIZATION & CACHE
# ==========================================
app = FastAPI(title="Local Lens Spatial Engine", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Core AI Models...")
try:
    nlp = spacy.load("en_core_web_sm")
    print("✅ spaCy NER Model Loaded")
except Exception as e:
    print("❌ Error loading spaCy. Did you run: python -m spacy download en_core_web_sm ?")

# Enterprise Geocache (Simulating a Vector DB / PostGIS lookup)
GEO_CACHE = {
    "T. Nagar": [13.0418, 80.2341],
    "Anna Nagar": [13.0850, 80.2101],
    "Sholinganallur": [12.9010, 80.2279],
    "Adyar": [13.0012, 80.2565],
    "Mylapore": [13.0335, 80.2675],
    "Velachery": [12.9790, 80.2220],
    "Delhi": [28.7041, 77.1025], 
    "Mumbai": [19.0760, 72.8777],
    "London": [51.5074, -0.1278],
    "Dubai": [25.2048, 55.2708]
}

# ==========================================
# 2. STATIC DATA INGESTION (Demo Continuity)
# ==========================================
try:
    with open("mock_data.json", "r", encoding="utf-8") as file:
        STATIC_COMMENTS = json.load(file)
    print("✅ Verified Dataset Loaded for Demo")
except FileNotFoundError:
    print("⚠️ Warning: mock_data.json not found! Falling back to empty DB.")
    STATIC_COMMENTS = {}

MEMORY_DB = []

# ==========================================
# 3. THE ENTERPRISE AI PIPELINE
# ==========================================
def process_spatial_influence(name: str, base: str):
    """
    Multi-stage AI Pipeline for Spatial Audience Analysis.
    Stages: Sentiment Check -> NER Extraction -> Outlier Detection -> DBSCAN Clustering.
    """
    if name not in STATIC_COMMENTS:
        return None # Prevent hallucinating data for non-existent creators

    raw_comments = STATIC_COMMENTS[name]
    
    valid_coords = []
    sentiment_filtered = 0
    spam_detected = 0

    # STAGE 1 & 2: NLP Intent & Sentiment Filtering
    for text in raw_comments:
        # A. Sentiment Analysis (Ignore negative comments/complaints)
        blob = TextBlob(text)
        if blob.sentiment.polarity < -0.1:
            sentiment_filtered += 1
            continue # Skip this comment, it's negative!
        
        # B. Named Entity Recognition (NER)
        doc = nlp(text)
        location_found = False
        for ent in doc.ents:
            if ent.text in GEO_CACHE:
                # Introduce micro-variance for realistic map clustering
                lat = GEO_CACHE[ent.text][0] + random.uniform(-0.005, 0.005)
                lng = GEO_CACHE[ent.text][1] + random.uniform(-0.005, 0.005)
                valid_coords.append([lat, lng])
                location_found = True
                break # Only plot one coordinate per comment
        
        # C. Basic Spam Heuristic (No location, short text, emojis)
        if not location_found and len(text) < 10:
            spam_detected += 1

    # STAGE 3: Unsupervised Spatial Clustering (DBSCAN)
    if len(valid_coords) > 3:
        X = np.array(valid_coords)
        
        # eps = ~3km radius, min_samples requires a local density of at least 3 points
        db = DBSCAN(eps=0.03, min_samples=3).fit(X)
        labels = list(db.labels_)
        
        # '0' represents the primary dense cluster. '-1' represents global noise/bots.
        core_cluster_size = labels.count(0)
        global_noise_size = labels.count(-1)
        
        raw_density_score = int((core_cluster_size / len(raw_comments)) * 100)
    else:
        raw_density_score, global_noise_size, core_cluster_size = 0, 0, 0

    # STAGE 4: Model Confidence & Bot Probability Math
    bot_probability = min(100, int((spam_detected / len(raw_comments)) * 100))
    model_confidence = min(99, int(((len(valid_coords) / len(raw_comments)) * 100) + 15))

    return {
        "id": name.lower().replace(" ", "_"),
        "name": name,
        "primary_base": base,
        "dbscan_score": raw_density_score,
        
        # New Advanced AI Metrics for the Dashboard
        "ai_telemetry": {
            "total_comments_analyzed": len(raw_comments),
            "usable_data_points": len(valid_coords),
            "global_noise_filtered": global_noise_size,
            "negative_sentiment_ignored": sentiment_filtered,
            "bot_spam_probability": f"{bot_probability}%",
            "model_confidence": f"{model_confidence}%"
        }
    }

# ==========================================
# 4. API ROUTING
# ==========================================
@app.on_event("startup")
def seed_database():
    """Auto-run the AI pipeline on all users in the mock JSON on server start."""
    for creator_name in STATIC_COMMENTS.keys():
        # Derive their base from the first few comments for the seed
        base = "T. Nagar" if "T. Nagar" in str(STATIC_COMMENTS[creator_name]) else "Adyar"
        if "Sholinganallur" in str(STATIC_COMMENTS[creator_name]): base = "Sholinganallur"
        if "Anna Nagar" in str(STATIC_COMMENTS[creator_name]): base = "Anna Nagar"
        
        result = process_spatial_influence(creator_name, base)
        if result:
            MEMORY_DB.append(result)
    print(f"✅ AI Engine initialized with {len(MEMORY_DB)} Verified Profiles.")

@app.get("/creators")
def get_all_creators():
    """Endpoint for Brand Dashboard."""
    return MEMORY_DB

class CreatorRequest(BaseModel):
    name: str
    primary_base: str

@app.post("/calculate-score")
def calculate_locality_score(request: CreatorRequest):
    """Endpoint for Creator Auth Fast-Forward."""
    new_data = process_spatial_influence(request.name, request.primary_base)
    
    if not new_data:
        raise HTTPException(status_code=404, detail="Creator not found in verified dataset.")
        
    # Update Memory DB
    existing_index = next((i for i, c in enumerate(MEMORY_DB) if c['name'] == new_data['name']), None)
    if existing_index is not None:
        MEMORY_DB[existing_index] = new_data
    else:
        MEMORY_DB.append(new_data)
        
    return new_data

# Run using: uvicorn main:app --reload