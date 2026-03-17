import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeFeed from './pages/HomeFeed';
import AddPint from './pages/AddPint';
import PintDetail from './pages/PintDetail';
import PubDetail from './pages/PubDetail';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B0D11] text-[#F5F2EA] pb-24 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/add" element={<AddPint />} />
          <Route path="/pint/:id" element={<PintDetail />} />
          <Route path="/pub/:placeId" element={<PubDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <NavBar />
      </div>
    </Router>
  );
}

export default App;