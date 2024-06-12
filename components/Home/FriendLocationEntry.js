import React, { useState } from 'react';
import { updateDriverPosition } from '../../app/RealTimeTracking';

const FriendLocationEntry = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [driverId, setDriverId] = useState('');

  const handleUpdatePosition = async (e) => {
    e.preventDefault();
    try {
      await updateDriverPosition(driverId, parseFloat(latitude), parseFloat(longitude));
      alert('Position mise à jour avec succès');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la position", error);
    }
  };

  return (
    <form onSubmit={handleUpdatePosition}>
      <div>
        <label>ID du chauffeur</label>
        <input
          type="text"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Latitude</label>
        <input
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Longitude</label>
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </div>
      <button type="submit">Mettre à jour la position</button>
    </form>
  );
};

export default FriendLocationEntry;
