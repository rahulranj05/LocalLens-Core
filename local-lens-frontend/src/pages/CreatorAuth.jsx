import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Camera, Loader2, MapPin, Zap, ShieldCheck } from 'lucide-react';

export default function CreatorAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: 'Rahul Ranjan', // Defaulted to your mock data name for the demo
    primary_base: 'T. Nagar'
  });

  const processLogin = async (name, base) => {
    setLoading(true);
    try {
      const aiResponse = await fetch('http://127.0.0.1:8000/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, primary_base: base })
      });
      
      if (!aiResponse.ok) throw new Error("Creator not found in verified dataset");
      
      const enterpriseData = await aiResponse.json();

      // Save the complete AI payload (including ai_telemetry)
      localStorage.setItem('currentCreator', JSON.stringify(enterpriseData));
      
      const existingDB = JSON.parse(localStorage.getItem('creators_db') || '[]');
      const updatedDB = existingDB.filter(c => c.name !== enterpriseData.name);
      updatedDB.push(enterpriseData);
      localStorage.setItem('creators_db', JSON.stringify(updatedDB));

      navigate('/creator/dashboard');
    } catch (error) {
      console.error("AI Scan failed", error);
      alert("Error: Make sure your Python Server is running and the name matches mock_data.json!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
        
        <div className="flex justify-center mb-6 relative">
          <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
            <UserCircle className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Creator Setup</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Enterprise verification via <span className="text-purple-400 font-mono italic">LocalLens NLP</span>.
        </p>

        <button 
          onClick={(e) => { e.preventDefault(); processLogin("Rahul Ranjan", "T. Nagar"); }}
          disabled={loading}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-3 mb-6 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <><Zap className="w-5 h-5 fill-current" /> Fast-Forward: Demo Mode</>
          )}
        </button>

        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-gray-800"></div>
          <span className="shrink-0 mx-4 text-gray-600 text-[10px] uppercase tracking-widest font-bold">Standard Audit</span>
          <div className="grow border-t border-gray-800"></div>
        </div>

        <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); processLogin(formData.name, formData.primary_base); }}>
          <div className="relative">
            <Camera className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input 
              type="text" required placeholder="Exact Name from mock_data.json" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-purple-500 text-sm" 
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <select 
              value={formData.primary_base} onChange={(e) => setFormData({...formData, primary_base: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-purple-500 text-sm appearance-none cursor-pointer"
            >
              <option value="T. Nagar">T. Nagar</option>
              <option value="Anna Nagar">Anna Nagar</option>
              <option value="Sholinganallur">Sholinganallur</option>
              <option value="Adyar">Adyar</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 font-semibold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-purple-500" /> : <><ShieldCheck className="w-5 h-5 text-purple-500" /> Run Enterprise AI Scan</>}
          </button>
        </form>
      </div>
    </div>
  );
}