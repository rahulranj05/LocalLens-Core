import { useState, useEffect } from 'react';
import { Search, MapPin, Target, ShieldCheck, X, DollarSign, FileText, Send } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 

const storeIcon = new L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="relative flex items-center justify-center w-10 h-10">
      <div class="absolute w-full h-full bg-yellow-500 rounded-full animate-ping opacity-50"></div>
      <div class="relative w-8 h-8 bg-yellow-500 border-2 border-white rounded-full shadow-[0_0_15px_rgba(234,179,8,1)] flex items-center justify-center z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const locationCoords = {
  'T. Nagar': { lat: 13.0418, lng: 80.2341 },
  'Anna Nagar': { lat: 13.0850, lng: 80.2101 },
  'Sholinganallur': { lat: 12.9010, lng: 80.2279 },
  'Adyar': { lat: 13.0012, lng: 80.2565 },
  'Mylapore': { lat: 13.0335, lng: 80.2675 }
};

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom, {duration: 1.5}); }, [center]);
  return null;
}

export default function BrandDashboard() {
  const [searchArea, setSearchArea] = useState('T. Nagar'); 
  const [hasSearched, setHasSearched] = useState(true); 
  const [creatorsList, setCreatorsList] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState(null);
  const [inviteForm, setInviteForm] = useState({ requirements: '', price: '' });
  const [sentInvites, setSentInvites] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/creators')
      .then(res => res.json())
      .then(data => setCreatorsList(data));
      
    const existingInvites = JSON.parse(localStorage.getItem('local_lens_invites') || '[]');
    setSentInvites(existingInvites.map(inv => inv.creatorName));
  }, []);

  const processedCreators = creatorsList.map(c => {
    const brandLoc = locationCoords[searchArea] || locationCoords['T. Nagar'];
    const creatorLoc = locationCoords[c.primary_base];
    const dist = getDistance(brandLoc.lat, brandLoc.lng, creatorLoc.lat, creatorLoc.lng);
    const decay = Math.pow(0.88, dist / 2); 
    return { ...c, targetedScore: Math.round(c.dbscan_score * decay), distance: dist.toFixed(1) };
  });

  const filtered = processedCreators.sort((a, b) => b.targetedScore - a.targetedScore);

  const openInviteModal = (creator) => {
    setInviteTarget(creator);
    setIsModalOpen(true);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    const newInvite = {
      id: Date.now(),
      brandName: "Local Cafe Demo", 
      brandLocation: searchArea,
      creatorName: inviteTarget.name,
      requirements: inviteForm.requirements,
      price: inviteForm.price,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };

    const existingInvites = JSON.parse(localStorage.getItem('local_lens_invites') || '[]');
    localStorage.setItem('local_lens_invites', JSON.stringify([newInvite, ...existingInvites]));
    
    setSentInvites([...sentInvites, inviteTarget.name]);
    setIsModalOpen(false);
    setInviteForm({ requirements: '', price: '' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans relative">
      
      {/* --- INVITE MODAL OVERLAY --- 
          FIXED: Changed z-50 to z-[9999] so it forces its way above the Leaflet Map */}
      {isModalOpen && inviteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5"/></button>
            <h2 className="text-2xl font-bold mb-1">Draft Proposal</h2>
            <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">Targeting <span className="font-bold text-purple-400">{inviteTarget.name}</span></p>
            
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2"><FileText className="w-3 h-3"/> Campaign Requirements</label>
                <textarea 
                  required
                  placeholder="e.g., We need 1 Instagram Reel and 2 Stories visiting our new cafe."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 min-h-25"
                  value={inviteForm.requirements}
                  onChange={(e) => setInviteForm({...inviteForm, requirements: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2"><DollarSign className="w-3 h-3"/> Price Expectation (₹)</label>
                <input 
                  type="number" required placeholder="e.g., 5000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                  value={inviteForm.price}
                  onChange={(e) => setInviteForm({...inviteForm, price: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer">
                <Send className="w-4 h-4"/> Send Binding Proposal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- STANDARD DASHBOARD --- */}
      <div className="bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10 shadow-xl">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            <Target className="w-6 h-6 text-pink-500" /> Local Lens Business
          </h1>
          <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">
            <MapPin className="w-4 h-4 text-purple-400" />
            Active Location: <span className="font-bold text-white ml-1">{searchArea}</span>
          </div>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); setHasSearched(true); }} className="flex-1 max-w-xl ml-8 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Change Neighborhood (e.g., Adyar)" value={searchArea} onChange={(e) => setSearchArea(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white focus:border-purple-500 outline-none" />
          <button type="submit" className="absolute right-2 top-2 bg-purple-600 px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer hover:bg-purple-500 transition-colors">Analyze</button>
        </form>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-1/3 bg-gray-950 border-r border-gray-800 p-6 overflow-y-auto z-10 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Targeted Matches</h2>
          <div className="space-y-4">
            {filtered.map(c => (
              <div key={c.id} onClick={() => setSelectedCreator(c)} className={`bg-gray-900 border rounded-2xl p-5 cursor-pointer relative transition-all ${selectedCreator?.id === c.id ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-gray-800 hover:border-gray-700'}`}>
                <div className="absolute top-0 right-0 bg-green-900/50 text-green-400 border-b border-l border-green-900 text-[10px] font-black px-3 py-1 rounded-bl-lg flex items-center gap-1 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Safe
                </div>
                <div className="flex items-center gap-4 mb-4 mt-2">
                  <div className="w-12 h-12 bg-linear-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-lg">{c.name.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{c.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">Verified Base: {c.primary_base}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Locality Influence Score</p>
                    <p className="text-3xl font-black text-white">{c.targetedScore}<span className="text-sm text-purple-400 font-normal">/100</span></p>
                    <p className="text-[10px] text-purple-400 font-bold mt-1 tracking-tighter">📍 {c.distance} km from shop</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openInviteModal(c); }}
                    disabled={sentInvites.includes(c.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer transition-all ${sentInvites.includes(c.name) ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-white text-black hover:bg-gray-200'}`}
                  >
                    {sentInvites.includes(c.name) ? 'Invited' : 'Invite'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 relative bg-gray-900 z-0">
          <MapContainer center={[13.04, 80.23]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <ChangeView center={locationCoords[searchArea] ? [locationCoords[searchArea].lat, locationCoords[searchArea].lng] : [13.04, 80.23]} zoom={selectedCreator ? 13 : 12} />
            
            {locationCoords[searchArea] && (
                <Marker position={[locationCoords[searchArea].lat, locationCoords[searchArea].lng]} icon={storeIcon}>
                    <Popup className="custom-popup">
                        <div className="font-bold text-gray-950">Business Location</div>
                        <div className="text-xs text-gray-600 italic">{searchArea}</div>
                    </Popup>
                </Marker>
            )}
            
            {selectedCreator && locationCoords[selectedCreator.primary_base] && (
               <Circle center={[locationCoords[selectedCreator.primary_base].lat, locationCoords[selectedCreator.primary_base].lng]} radius={(selectedCreator.dbscan_score * selectedCreator.dbscan_score) / 1.5} pathOptions={{ color: '#a855f7', fillColor: '#c084fc', fillOpacity: 0.4, weight: 3, dashArray: '5, 10' }}>
                  <Popup offset={[0, -20]}>
                    <div className="p-2 min-w-40 text-gray-900">
                      <h3 className="font-bold text-lg leading-tight m-0">{selectedCreator.name}</h3>
                      <div className="w-full h-px bg-gray-200 my-2"></div>
                      <p className="text-[10px] m-0 uppercase font-bold text-gray-500 mb-1">AI Telemetry</p>
                      <p className="text-xs m-0 font-medium">Spam Risk: <span className="text-green-600 font-bold">{selectedCreator.ai_telemetry?.bot_spam_probability || 'Low'}</span></p>
                    </div>
                  </Popup>
               </Circle>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
