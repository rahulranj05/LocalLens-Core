import { BarChart3, MapPin, Bell, CheckCircle2, XCircle } from 'lucide-react';

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-linear-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
            FG
          </div>
          <div>
            <h1 className="text-3xl font-bold">Chennai Foodie Giri</h1>
            <p className="text-gray-400 flex items-center gap-1"><MapPin className="w-4 h-4" /> Primary Base: T. Nagar</p>
          </div>
        </div>
        <button className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 relative">
          <Bell className="w-6 h-6 text-gray-300" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Stat Cards */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 font-semibold mb-2">Total Followers</h3>
          <p className="text-4xl font-extrabold">124K</p>
          <p className="text-sm text-green-400 mt-2">+2.4% this month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 font-semibold mb-2">Local Chennai Audience</h3>
          <p className="text-4xl font-extrabold text-purple-400">68%</p>
          <p className="text-sm text-gray-500 mt-2">Verified via AI NLP Scan</p>
        </div>
        <div className="bg-linear-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
          <BarChart3 className="absolute right-5 bottom-5 w-32 h-32 text-purple-500/10" />
          <h3 className="text-purple-200 font-semibold mb-2">Locality Influence Score</h3>
          <p className="text-5xl font-extrabold text-white">92<span className="text-2xl text-purple-300">/100</span></p>
          <p className="text-sm text-purple-300 mt-2">Top 5% in T. Nagar Zip Codes</p>
        </div>
      </div>

      {/* Incoming Proposals Section */}
      <h2 className="text-2xl font-bold mb-6">Inbound Campaigns</h2>
      
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-900/50 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">New Proposal</span>
            <span className="text-gray-400 text-sm">2 hours ago</span>
          </div>
          <h3 className="text-xl font-bold">Filter Kaapi Co. (Anna Nagar)</h3>
          <p className="text-gray-400 max-w-2xl mt-1">
            "We are launching a new cold brew menu this weekend. Looking for an Instagram Reel visiting the shop and tasting 3 items. Budget includes food + payout."
          </p>
          <div className="mt-4 flex gap-4 font-semibold text-lg">
            <span className="text-green-400">Offer: ₹5,000</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">Platform: Instagram Reel</span>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
            <CheckCircle2 className="w-5 h-5" /> Accept
          </button>
          <button className="flex-1 md:flex-none bg-gray-800 hover:bg-red-900/80 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
            <XCircle className="w-5 h-5" /> Decline
          </button>
        </div>
      </div>

    </div>
  );
}