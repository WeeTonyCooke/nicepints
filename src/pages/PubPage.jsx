import React from 'react';
import { useParams } from 'react-router-dom';
import PintCard from '../components/PintCard';
import { useData } from '../context/DataContext';

const PubPage = () => {
  const { id } = useParams();
  const { pubs, pints } = useData(); // Grab both arrays from global state
  
  const pub = pubs.find(p => p.id === id);
  
  if (!pub) return <h2>Pub not found</h2>;

  // Filter the live pints array for this specific pub
  const pubPints = pints.filter(p => p.pub_id === pub.id);
  
  // Calculate stats dynamically
  const avgScore = pubPints.length > 0 
    ? (pubPints.reduce((acc, curr) => acc + curr.score, 0) / pubPints.length).toFixed(1)
    : 'N/A';

  return (
    <div className="pub-page">
      <div className="pub-header">
        <h2>{pub.name}</h2>
        <p>{pub.city}</p>
        <div className="pub-stats">
          <span>Average Score: <strong>{avgScore}</strong></span>
          <span>Total Pints: <strong>{pubPints.length}</strong></span>
        </div>
      </div>

      <div className="recent-pints">
        <h3>Recent pints from this pub</h3>
        <div className="feed">
          {pubPints.map(pint => (
            <PintCard key={pint.id} pint={pint} />
          ))}
          {pubPints.length === 0 && <p>No pints recorded here yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default PubPage;