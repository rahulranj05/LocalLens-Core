import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Using guaranteed icons: UserCircle, Mail, Camera, Video
import { UserCircle, Mail, Camera, Video } from 'lucide-react';

export default function CreatorAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const handleDemoLogin = (e) => {
    e.preventDefault();
    navigate('/creator/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <UserCircle className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Creator Setup'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Verify your local audience and get inbound brand deals.
        </p>

        <button 
          onClick={handleDemoLogin}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mb-6 transition-all shadow-lg shadow-purple-500/20"
        >
          🚀 Fast-Forward: Log in as Demo Creator
        </button>

        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-gray-700"></div>
          <span className="shrink-0 mx-4 text-gray-500 text-sm">or standard setup</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        <form className="space-y-4" onSubmit={handleDemoLogin}>
          {!isLogin && (
            <>
              <div className="relative">
                {/* Swapped to Camera */}
                <Camera className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Instagram Handle" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="relative">
                {/* Swapped to Video */}
                <Video className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="YouTube Channel (Optional)" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500" />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="email" placeholder="Email Address" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500" />
          </div>
          
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 rounded-lg transition-colors">
            {isLogin ? 'Sign In' : 'Connect Account'}
          </button>
        </form>
      </div>
    </div>
  );
}