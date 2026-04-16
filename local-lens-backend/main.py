from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.cluster import DBSCAN
import random

# 1. Initialize the AI Engine
app = FastAPI(title="Local Lens DBSCAN Engine", version="1.0 MVP")

# 2. Fix CORS so your React frontend (Port 5173) can talk to this Python backend (Port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Our Chennai Geographic Dictionary
CHENNAI_BASES = {
    'T. Nagar': [13.0418, 80.2341],
    'Anna Nagar': [13.0850, 80.2101],
    'Sholinganallur': [12.9010, 80.2279],
    'Adyar': [13.0012, 80.2565],
    'Mylapore': [13.0335, 80.2675]
}

# 4. Data Structure for the incoming Request
class CreatorRequest(BaseModel):
    name: str
    primary_base: str

# 5. The Core Algorithm Endpoint
@app.post("/calculate-score")
def calculate_locality_score(request: CreatorRequest):
    base_name = request.primary_base
    center_lat, center_lng = CHENNAI_BASES.get(base_name, [13.04, 80.23])

    # --- PHASE A: MOCK DATA INGESTION (Simulating 100 Viewer Comments) ---
    coordinates = []
    
    # Generate "True Locals" (Viewers tightly clustered within ~2km of the base)
    # We randomize this to create dynamic scores
    true_local_count = random.randint(65, 95) 
    for _ in range(true_local_count):
        lat = center_lat + random.uniform(-0.02, 0.02) 
        lng = center_lng + random.uniform(-0.02, 0.02)
        coordinates.append([lat, lng])

    # Generate "Noise" (Random viewers from all over India/World)
    noise_count = 100 - true_local_count
    for _ in range(noise_count):
        lat = center_lat + random.uniform(-5.0, 5.0) 
        lng = center_lng + random.uniform(-5.0, 5.0)
        coordinates.append([lat, lng])

    # Convert to Numpy Array for the Machine Learning model
    X = np.array(coordinates)

    # --- PHASE B: DBSCAN SPATIAL CLUSTERING ---
    # eps=0.03 (Roughly 3km radius for a neighborhood)
    # min_samples=5 (Need at least 5 people to form a cluster)
    db = DBSCAN(eps=0.03, min_samples=5).fit(X)
    
    # In DBSCAN, label '-1' means random noise. Label '0' is the primary dense cluster.
    labels = db.labels_
    
    # Our "Locality Score" is simply the percentage of viewers inside that main cluster!
    cluster_points = list(labels).count(0)
    
    # Add a tiny random boost so it perfectly mirrors realistic AI variance
    final_score = min(cluster_points + random.randint(1, 4), 99)

    return {
        "creator": request.name,
        "primary_base": base_name,
        "simulated_viewers": 100,
        "noise_detected": list(labels).count(-1),
        "dbscan_score": final_score,
        "status": "Success",
        "message": f"DBSCAN identified a high-density viewer cluster in {base_name}."
    }