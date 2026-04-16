import { Store, UserCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-6 mb-12">
        <div className="flex justify-center mb-4">
          <MapPin className="w-16 h-16 text-blue-500" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">
          Local <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Lens</span>
        </h1>
        <p className="text-xl text-gray-400">
          Hyper-Local Digital Marketing Intelligence. Stop guessing where your audience is. Start knowing.
        </p>
      </div>

      {/* The Gateway Buttons */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Brand Card */}
        <Link to="/brand/auth" className="group relative rounded-2xl border border-gray-800 bg-gray-900 p-8 transition-all hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center text-center cursor-pointer">
          <Store className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">I am a Brand</h2>
          <p className="text-gray-400">Find the perfect vernacular creators in your exact zip code to drive real local footfall.</p>
        </Link>

        {/* Creator Card */}
        <Link to="/creator/auth" className="group relative rounded-2xl border border-gray-800 bg-gray-900 p-8 transition-all hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col items-center text-center cursor-pointer">
          <UserCircle className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">I am a Creator</h2>
          <p className="text-gray-400">Prove your local influence. Connect your analytics to get your verified Locality Score and land local deals.</p>
        </Link>

      </div>
    </div>
  );
}