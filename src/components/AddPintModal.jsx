import React, { useState } from 'react';
import { useData } from '../context/DataContext'; // Import the custom hook

const AddPintModal = ({ isOpen, onClose }) => {
  const { addPint } = useData(); // Consume the context
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    photo: null,
    score: 5,
    note: '',
    locationMethod: 'skip' 
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  
  const handleSubmit = () => {
    addPint(formData); // Push the data to our global state
    
    // Reset and close
    setFormData({ photo: null, score: 5, note: '', locationMethod: 'skip' });
    setStep(1); 
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="btn-close">X</button>
        
        {step === 1 && (
          <div className="step-1">
            <h2>Step 1: Upload Photo</h2>
            <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} />
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-2">
            <h2>Step 2: Score the Pint</h2>
            <input 
              type="range" min="0" max="10" step="0.1" 
              value={formData.score} 
              onChange={(e) => setFormData({...formData, score: e.target.value})}
            />
            <p>Score: {formData.score}</p>
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div className="step-3">
            <h2>Step 3: Add a Note (Optional)</h2>
            <textarea 
              placeholder="How was the dome? The temperature?"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
            />
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 4 && (
          <div className="step-4">
            <h2>Step 4: Where was this pint?</h2>
            <select 
              value={formData.locationMethod} 
              onChange={(e) => setFormData({...formData, locationMethod: e.target.value})}
            >
              <option value="location">📍 Use my location</option>
              <option value="search">🔍 Search pub</option>
              <option value="manual">➕ Add pub manually</option>
              <option value="skip">⏭️ Skip</option>
            </select>
            
            <div className="form-actions">
              <button onClick={handleBack}>Back</button>
              <button onClick={handleSubmit} className="btn-submit">Post Pint</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPintModal;