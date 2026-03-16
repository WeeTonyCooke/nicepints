import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const PintCard = ({ pint }) => {
  const { pubs } = useData(); // Get pubs from context instead of static file
  const [liked, setLiked] = useState(false);
  
  // Find the pub associated with this pint
  const pub = pubs.find(p => p.id === pint.pub_id);

  return (
    <div className="pint-card">
      <img src={pint.photo_url} alt="A pint of Guinness" className="pint-photo" />
      <div className="pint-details">
        <div className="pint-header">
          <h3>Score: {pint.score}/10</h3>
          <span className="user">@{pint.user}</span>
        </div>
        
        {pub ? (
          <p className="pub-location">📍 {pub.name}, {pub.city}</p>
        ) : (
          <p className="pub-location">📍 Location not provided</p>
        )}
        
        <p className="caption">"{pint.caption}"</p>
        
        <button 
          onClick={() => setLiked(!liked)} 
          className={`btn-like ${liked ? 'liked' : ''}`}
        >
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>
      </div>
    </div>
  );
};

export default PintCard;