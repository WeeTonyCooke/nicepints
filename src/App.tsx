import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import AgeGate from './components/AgeGate';
import HomeFeed from './pages/HomeFeed';
import AddPint from './pages/AddPint';
import PintDetail from './pages/PintDetail';
import PubDetail from './pages/PubDetail';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import Legal from './pages/Legal';
import RequestPub from './pages/RequestPub';
import PublicUserProfile from './pages/PublicUserProfile';
import NavBar from './components/NavBar';
import ChooseNamePrompt from './components/ChooseNamePrompt';
import { hasConfirmedAge } from './utils/ageGate';

function MainLayout() {
  return (
    <div className="min-h-screen bg-stout text-cream pb-safe-content overflow-x-hidden">
      <Outlet />
      <NavBar />
    </div>
  );
}

function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(hasConfirmedAge);

  return (
    <AuthProvider>
      {!ageConfirmed && <AgeGate onConfirmed={() => setAgeConfirmed(true)} />}
      <ChooseNamePrompt />
      <Router>
        <Routes>
          <Route path="/legal" element={<Legal />} />
          <Route path="/request-pub" element={<RequestPub />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeFeed />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/add" element={<AddPint />} />
            <Route path="/pint/:id" element={<PintDetail />} />
            <Route path="/pub/:placeId" element={<PubDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:userId" element={<PublicUserProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
