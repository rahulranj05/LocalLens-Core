import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrandAuth from './pages/BrandAuth';
import BrandDashboard from './pages/BrandDashboard';
import CreatorAuth from './pages/CreatorAuth';
import CreatorDashboard from './pages/CreatorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/brand/auth" element={<BrandAuth />} />
        <Route path="/brand/dashboard" element={<BrandDashboard />} />
        
        <Route path="/creator/auth" element={<CreatorAuth />} />
        <Route path="/creator/dashboard" element={<CreatorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;