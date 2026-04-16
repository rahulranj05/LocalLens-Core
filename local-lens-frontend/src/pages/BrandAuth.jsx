import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, MapPin, Briefcase } from 'lucide-react';

export default function BrandAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  // The hackathon demo bypass!
  const handleDemoLogin = (e) => {
    e.preventDefault();
    // In a real app, this sets user state. For now, it just routes them.
    navigate('/brand/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <Store className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Create Brand Account'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Find the perfect local creators for your business.
        </p>

        {/* The Hackathon Demo Login Button */}
        <button 
          onClick={handleDemoLogin}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mb-6 transition-all shadow-lg shadow-blue-500/20"
        >
          🚀 Fast-Forward: Log in as Demo Brand
        </button>

        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-gray-700"></div>
          <span className="shrink-0 mx-4 text-gray-500 text-sm">or standard setup</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        {/* The Standard Auth Form */}
        <form className="space-y-4" onSubmit={handleDemoLogin}>
          {!isLogin && (
            <>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Business Name" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Business Zip Code (e.g., 600040)" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="email" placeholder="Business Email" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" />
          </div>
          
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 rounded-lg transition-colors">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>

      </div>
    </div>
  );
}