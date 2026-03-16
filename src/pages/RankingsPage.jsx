import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const RankingsPage = () => {
  const { pubs, pints } = useData();

  // Calculate stats, filter out unrated pubs, and sort highest to lowest
  const rankedPubs = pubs.map(pub => {
    const pubPints = pints.filter(p => p.pub_id === pub.id);
    
    const avgScore = pubPints.length > 0
      ? (pubPints.reduce((acc, curr) => acc + curr.score, 0) / pubPints.length)
      : 0;

    return {
      ...pub,
      avgScore: parseFloat(avgScore.toFixed(1)),
      totalPints: pubPints.length
    };
  })
  .filter(pub => pub.totalPints > 0) 
  .sort((a, b) => b.avgScore - a.avgScore); 

  return (
    <div className="rankings-page">
      <h2>Top Rated Pubs</h2>
      <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>
        The best pints in the city, ranked by the community.
      </p>

      <div className="rankings-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rankedPubs.map((pub, index) => (
          <div 
            key={pub.id} 
            className="ranking-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: '#fff', 
              border: '1px solid #e4e4e7', 
              padding: '1rem', 
              borderRadius: '12px' 
            }}
          >
            {/* Rank Number */}
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d4af37', width: '40px' }}>
              #{index + 1}
            </div>
            
            {/* Pub Info */}
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{pub.name}</h3>
              <p style={{ margin: 0, color: '#71717a', fontSize: '0.85rem' }}>
                {pub.city} • {pub.totalPints} {pub.totalPints === 1 ? 'pint' : 'pints'}
              </p>
            </div>
            
            {/* Average Score */}
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginRight: '1rem' }}>
              {pub.avgScore}
            </div>
            
            {/* Action Button */}
            <Link 
              to={`/pub/${pub.id}`} 
              className="btn-view-pub" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', margin: 0 }}
            >
              View
            </Link>
          </div>
        ))}
        
        {rankedPubs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #d4d4d8', borderRadius: '12px' }}>
            <p>No pubs have been rated yet. Be the first to add a pint!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingsPage;