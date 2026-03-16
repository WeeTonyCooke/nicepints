import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const AddPintModal = ({ isOpen, onClose }) => {
  // Grab pubs from context for the search filter
  const { addPint, pubs } = useData(); 
  const [step, setStep] = useState(1);
  
  // Expanded form data to handle search and manual entry
  const [formData, setFormData] = useState({
    photo: null,
    score: 5,
    note: '',
    locationMethod: 'skip',
    latitude: null,
    longitude: null,
    selectedPubId: '', // For the search flow
    newPubName: '',    // For the manual flow
    newPubCity: ''     // For the manual flow
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Local state just for typing in the search box
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  
  const handleSubmit = () => {
    addPint(formData);
    
    // Total reset on submit
    setFormData({ 
      photo: null, score: 5, note: '', locationMethod: 'skip', 
      latitude: null, longitude: null, selectedPubId: '', newPubName: '', newPubCity: '' 
    });
    setSearchQuery('');
    setStep(1); 
    onClose();
  };

  const handleLocationMethodChange = (e) => {
    const method = e.target.value;
    setFormData({ ...formData, locationMethod: method, latitude: null, longitude: null });
    setLocationError('');

    if (method === 'location') {
      setIsLocating(true);
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser.');
        setIsLocating(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error(error);
          setLocationError('Unable to retrieve your location.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  // Filter pubs based on what the user types
  const filteredPubs = pubs.filter(pub => 
    pub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="btn-close">X</button>
        
        {step === 1 && ( /* ... Step 1 code remains the same ... */ )}
        {step === 2 && ( /* ... Step 2 code remains the same ... */ )}
        {step === 3 && ( /* ... Step 3 code remains the same ... */ )}

        {step === 4 && (
          <div className="step-4">
            <h2>Step 4: Where was this pint?</h2>
            <select 
              value={formData.locationMethod} 
              onChange={handleLocationMethodChange}
              style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
            >
              <option value="skip">⏭️ Skip</option>
              <option value="location">📍 Use my location</option>
              <option value="search">🔍 Search pub</option>
              <option value="manual">➕ Add pub manually</option>
            </select>
            
            {/* --- LOCATION UI --- */}
            {isLocating && <p>Locating you...</p>}
            {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
            {formData.latitude && <p style={{ color: 'green' }}>Location locked!</p>}

            {/* --- SEARCH UI --- */}
            {formData.locationMethod === 'search' && (
              <div className="search-flow">
                <input 
                  type="text" 
                  placeholder="Type pub name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <div className="search-results" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc' }}>
                  {filteredPubs.map(pub => (
                    <div 
                      key={pub.id}
                      onClick={() => setFormData({...formData, selectedPubId: pub.id})}
                      style={{ 
                        padding: '0.5rem', 
                        cursor: 'pointer', 
                        background: formData.selectedPubId === pub.id ? '#e0f7fa' : 'transparent' 
                      }}
                    >
                      <strong>{pub.name}</strong>, {pub.city}
                    </div>
                  ))}
                  {filteredPubs.length === 0 && <p style={{ padding: '0.5rem' }}>No pubs found.</p>}
                </div>
              </div>
            )}

            {/* --- MANUAL ADD UI --- */}
            {formData.locationMethod === 'manual' && (
              <div className="manual-flow" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Pub Name (e.g., The Cobblestone)" 
                  value={formData.newPubName}
                  onChange={(e) => setFormData({...formData, newPubName: e.target.value})}
                  style={{ padding: '0.5rem' }}
                />
                <input 
                  type="text" 
                  placeholder="City (e.g., Dublin)" 
                  value={formData.newPubCity}
                  onChange={(e) => setFormData({...formData, newPubCity: e.target.value})}
                  style={{ padding: '0.5rem' }}
                />
              </div>
            )}

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button onClick={handleBack}>Back</button>
              <button 
                onClick={handleSubmit} 
                className="btn-submit" 
                disabled={isLocating}
              >
                Post Pint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPintModal;