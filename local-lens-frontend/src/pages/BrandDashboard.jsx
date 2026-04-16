import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Open-Source Map Imports
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
// CRITICAL: Leaflet needs its CSS to look right, otherwise it breaks!
import 'leaflet/dist/leaflet.css'; 

// A quick dictionary to translate text locations into real GPS coordinates for the map
const locationCoords = {
  'T. Nagar': { lat: 13.0418, lng: 80.2341 },
  'Anna Nagar': { lat: 13.0850, lng: 80.2101 },
  'Sholinganallur': { lat: 12.9010, lng: 80.2279 },
  'Adyar': { lat: 13.0012, lng: 80.2565 },
  'Mylapore': { lat: 13.0335, lng: 80.2675 }
};

export default function BrandDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);

  // Fetch real data from your Supabase database
  useEffect(() => {
    async function fetchCreators() {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('locality_score', { ascending: false });

      if (!error) setCreators(data);
      setLoading(false);
    }
    fetchCreators();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      
      {/* Sidebar: Search & Creator List */}
      <div className="w-1/3 border-r border-gray-800 bg-gray-900 p-6 flex flex-col z-20 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="text-blue-500 w-8 h-8" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
            Local Lens
          </h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search Chennai..." 
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500"
          />
        </div>

        <h3 className="text-gray-400 font-semibold mb-4 text-sm uppercase">Live Local Data</h3>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10 text-gray-500" />
          ) : (
            creators.map((creator) => (
              <div 
                key={creator.id} 
                onClick={() => setSelectedCreator(creator)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCreator?.id === creator.id 
                    ? 'border-blue-500 bg-gray-800' 
                    : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{creator.name}</h4>
                    <p className="text-sm text-gray-400">{creator.niche} • {creator.primary_base}</p>
                  </div>
                  <div className="bg-blue-900/50 text-blue-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {creator.locality_score}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content: Leaflet Heatmap Area */}
      <div className="flex-1 relative z-0 bg-gray-900">
        <MapContainer 
          center={[13.04, 80.23]} // Center coordinates for Chennai
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Removes the +/- buttons for a cleaner UI
        >
          {/* This is the magic "Dark Mode" tile layer that makes it look premium */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Plotting the Influence Zones (Heatmap Circles) */}
          {creators.map(creator => {
            const coords = locationCoords[creator.primary_base];
            if (!coords) return null;

            const isSelected = selectedCreator?.id === creator.id;
            
            // MATH MAGIC: Higher score = exponentially larger radius
            const influenceRadius = (creator.locality_score * creator.locality_score) / 3;

            return (
              <Circle 
                key={creator.id} 
                center={[coords.lat, coords.lng]}
                radius={influenceRadius} 
                pathOptions={{
                  color: isSelected ? '#60a5fa' : '#a855f7', // Blue if clicked, Purple by default
                  fillColor: isSelected ? '#3b82f6' : '#c084fc',
                  fillOpacity: isSelected ? 0.6 : 0.3, // Semi-transparent effect
                  weight: isSelected ? 3 : 1, // Thicker border if clicked
                }}
                eventHandlers={{
                  click: () => setSelectedCreator(creator),
                }}
              >
                {/* The little info box that pops up when you click a circle */}
                {isSelected && (
                  <Popup offset={[0, -20]}>
                    <div className="p-1 min-w-37.5">
                      <h3 className="font-bold text-gray-900 text-lg m-0">{creator.name}</h3>
                      <p className="text-gray-600 text-sm m-0 mt-1">{creator.primary_base}</p>
                      <div className="mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold w-max">
                        Locality Score: {creator.locality_score}
                      </div>
                      <div className="mt-1 text-gray-500 text-[10px]">
                        Influence Radius: {Math.round(influenceRadius)}m
                      </div>
                    </div>
                  </Popup>
                )}
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}