import { useEffect, useState } from 'react';
import { BarChart3, MapPin, CheckCircle2, MessageSquare, ShieldCheck, BrainCircuit, Mail, IndianRupee, X } from 'lucide-react';

export default function CreatorDashboard() {
  const [creator, setCreator] = useState(null);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    // 1. Load Creator Data
    const saved = localStorage.getItem('currentCreator');
    if (saved) {
      const parsedCreator = JSON.parse(saved);
      setCreator(parsedCreator);
      
      // 2. Load Invites specifically for this creator
      const allInvites = JSON.parse(localStorage.getItem('local_lens_invites') || '[]');
      setInvites(allInvites.filter(inv => inv.creatorName === parsedCreator.name));
    }
  }, []);

  const handleInviteAction = (id, action) => {
    // Update Local State
    const updatedInvites = invites.map(inv => inv.id === id ? { ...inv, status: action } : inv);
    setInvites(updatedInvites);

    // Update Global Storage so Brand sees it eventually
    const allStored = JSON.parse(localStorage.getItem('local_lens_invites') || '[]');
    const globallyUpdated = allStored.map(inv => inv.id === id ? { ...inv, status: action } : inv);
    localStorage.setItem('local_lens_invites', JSON.stringify(globallyUpdated));
  };

  if (!creator || !creator.ai_telemetry) return <div className="text-purple-500 p-10 animate-pulse font-bold">Loading AI Analysis...</div>;

  const telemetry = creator.ai_telemetry;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 font-sans">
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-linear-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase shadow-lg shadow-purple-500/30">
            {creator.name.substring(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {creator.name} <CheckCircle2 className="w-6 h-6 text-purple-500" />
            </h1>
            <p className="text-gray-400 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" /> AI Verified Influencer Profile
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg"><MessageSquare className="w-6 h-6 text-blue-500" /></div>
            <h3 className="text-gray-400 font-semibold">Raw Data Ingestion</h3>
          </div>
          <p className="text-4xl font-extrabold">{telemetry.total_comments_analyzed}</p>
          <p className="text-sm text-gray-500 mt-2 italic">Unstructured comments scanned</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <MapPin className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg"><MapPin className="w-6 h-6 text-purple-500" /></div>
            <h3 className="text-gray-400 font-semibold">Verified Cluster Core</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-1">{creator.primary_base}</p>
          <div className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-1 rounded mt-3 uppercase tracking-tighter">
            DBSCAN Center
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/10 rounded-lg"><BarChart3 className="w-6 h-6 text-pink-500" /></div>
            <h3 className="text-purple-200 font-semibold">Locality Influence</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-6xl font-black text-white">{creator.dbscan_score}</p>
            <p className="text-2xl text-purple-300/60 font-bold">/100</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-purple-500"/> Pipeline Telemetry</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400 text-sm">Negative Sentiment Ignored</span>
              <span className="font-bold text-red-400">{telemetry.negative_sentiment_ignored} comments</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400 text-sm">Global Geographic Noise Filtered</span>
              <span className="font-bold text-yellow-400">{telemetry.global_noise_filtered} outliers</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Usable High-Quality Data Points</span>
              <span className="font-bold text-green-400">{telemetry.usable_data_points} mapped</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <h3 className="text-gray-400 font-semibold text-sm mb-2 uppercase tracking-widest">Bot/Spam Probability</h3>
          <p className="text-5xl font-black text-white">{telemetry.bot_spam_probability}</p>
          <p className="text-[10px] text-gray-500 mt-4 leading-tight">Calculated via syntax heuristics.</p>
        </div>
      </div>

      {/* --- NEW: COLLABORATION INBOX --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
          <Mail className="w-6 h-6 text-purple-500"/> Active Collaboration Requests
          {invites.length > 0 && <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">{invites.filter(i => i.status === 'pending').length} New</span>}
        </h2>

        {invites.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
             <p>No active proposals yet.</p>
             <p className="text-xs mt-2">Brands will discover your AI-Verified profile soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invites.map(invite => (
              <div key={invite.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <h3 className="font-bold text-lg">{invite.brandName}</h3>
                     <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded uppercase tracking-widest"><MapPin className="w-3 h-3 inline pb-0.5"/> {invite.brandLocation}</span>
                     <span className="text-[10px] text-gray-500 ml-2">{invite.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 italic mb-2">"{invite.requirements}"</p>
                  {/* Changed the icon here to IndianRupee! */}
                  <p className="text-green-400 font-bold flex items-center gap-1"><IndianRupee className="w-4 h-4"/>{invite.price} Offered</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  {invite.status === 'pending' ? (
                    <>
                      <button onClick={() => handleInviteAction(invite.id, 'deny')} className="flex-1 md:flex-none border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"><X className="w-4 h-4"/> Deny</button>
                      <button onClick={() => handleInviteAction(invite.id, 'accepted')} className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"><CheckCircle2 className="w-4 h-4"/> Accept Offer</button>
                    </>
                  ) : (
                    <div className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${invite.status === 'accepted' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                       {invite.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}