import React, { useState } from 'react';
import { Armchair } from 'lucide-react';

export default function SeatMap({ type, onConfirm, maxSeats = 1 }) {
  // Generate mock seats (30 seats total)
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Custom rows
  // Flight: rows 1 to 5, columns A to F (Aisle between C and D)
  // Bus: rows 1 to 6, columns A to D (Aisle between B and C)
  const rows = 5;
  const cols = type === 'flights' ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['A', 'B', 'C', 'D'];
  
  // Seeded booked seats
  const bookedSeats = ['1A', '2C', '3D', '4F', '5B', '2E'];

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return; // blocked
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= maxSeats) {
        // Replace first selected seat if max reached
        if (maxSeats === 1) {
          setSelectedSeats([seatId]);
        } else {
          setSelectedSeats([...selectedSeats.slice(1), seatId]);
        }
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    onConfirm(selectedSeats);
  };

  return (
    <div className="seatmap-container animate-scale-in">
      <h3 className="seatmap-title">Select {maxSeats} {maxSeats > 1 ? 'Seats' : 'Seat'}</h3>
      
      {/* Front indication */}
      <div style={{ 
        width: '120px', 
        height: '8px', 
        backgroundColor: '#cbd5e1', 
        borderRadius: '10px', 
        margin: '0 auto 20px auto', 
        fontSize: '9px',
        fontWeight: 'bold',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        FRONT / ENGINE SIDE
      </div>

      <div className={`seatmap-grid ${type === 'buses' ? 'bus-grid' : ''}`}>
        {Array.from({ length: rows }).map((_, rIdx) => {
          const rowNum = rIdx + 1;
          return cols.map((colLetter, cIdx) => {
            const seatId = `${rowNum}${colLetter}`;
            const isBooked = bookedSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);
            
            // Add aisle spacing
            const isAisle = type === 'flights' ? cIdx === 3 : cIdx === 2;
            
            return (
              <React.Fragment key={seatId}>
                {isAisle && <div style={{ gridColumnSpan: 1, width: '20px' }} />}
                <button
                  className={`seat-item ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                  onClick={() => toggleSeat(seatId)}
                  disabled={isBooked}
                  style={{ gridColumn: 'span 1' }}
                  title={`Seat ${seatId} - ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
                >
                  <Armchair size={14} style={{ marginBottom: '2px' }} />
                  {seatId}
                </button>
              </React.Fragment>
            );
          });
        })}
      </div>

      {/* Selected list */}
      {selectedSeats.length > 0 && (
        <div style={{ margin: '14px 0', fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
          Selected: {selectedSeats.join(', ')}
        </div>
      )}

      {/* Legend */}
      <div className="seatmap-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--bg-input)' }} />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#e2e8f0' }} />
          <span>Booked</span>
        </div>
      </div>

      <button 
        className="btn-primary" 
        style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
        onClick={handleConfirm}
        disabled={selectedSeats.length === 0}
      >
        Confirm Seats
      </button>
    </div>
  );
}
