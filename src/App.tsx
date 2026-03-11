import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeFeed from './pages/HomeFeed';
import PintDetail from './pages/PintDetail'; // We'll create/update this next
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stout text-cream pb-24">
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/pint/:id" element={<PintDetail />} />
          {/* Add other routes as you build them (Map, Profile, etc.) */}
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;