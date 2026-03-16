import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PubCard = ({ pub }) => {
  const { pints } = useData(); // Get pints from context to calculate dynamic stats

  // Calculate average score using live context data
  const pubPints = pints.filter(p => p.pub_id === pub.id);
  const avgScore = pubPints.length > 0 
    ? (pubPints.reduce((acc, curr) => acc + curr.score, 0) / pubPints.length).toFixed(1)
    : 'N/A';
    
  const recentPint = pubPints[0]; // Grab the most recent pint for the thumbnail

  return (
    <div className="pub-card">
      <h4>{pub.name}</h4>
      <p>{pub.city}</p>
      <p>Average Score: <strong>{avgScore}</strong></p>
      
      {recentPint && (
        <img src={recentPint.photo_url} alt="Recent pint" className="pub-card-thumbnail" width="100" />
      )}
      
      <Link to={`/pub/${pub.id}`} className="btn-view-pub">View Pub details</Link>
    </div>
  );
};

export default PubCard;