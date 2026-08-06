import React from 'react';
import { Plane, Hotel, Home, Palmtree, Train, Bus, Car } from 'lucide-react';

export default function SearchTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'flights', label: 'Flights', icon: <Plane size={20} /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={20} /> },
    { id: 'homestays', label: 'Homestays & Villas', icon: <Home size={20} /> },
    { id: 'packages', label: 'Holiday Packages', icon: <Palmtree size={20} /> },
    { id: 'trains', label: 'Trains', icon: <Train size={20} /> },
    { id: 'buses', label: 'Buses', icon: <Bus size={20} /> },
    { id: 'cabs', label: 'Cabs', icon: <Car size={20} /> }
  ];

  return (
    <div className="tabs-outer animate-fade-in-up" style={{ marginTop: '-30px' }}>
      <div className="tabs-card" style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '16px 20px', justifyContent: 'center' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{ minWidth: '90px' }}
          >
            <div className="tab-icon-wrapper" style={{ margin: '0 auto' }}>
              {tab.icon}
            </div>
            <span style={{ fontSize: '11px', marginTop: '6px', whiteSpace: 'nowrap' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
