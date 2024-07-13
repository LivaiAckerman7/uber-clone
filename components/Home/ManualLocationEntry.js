import React, { useState } from 'react';
import { updateLocation } from '../../app/RealTimeTracking';

function ManualLocationEntry() {
  const [taxiId, setTaxiId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taxiId && latitude && longitude) {
      updateLocation(taxiId, { latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
      alert('Location updated');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-2">
        <label className="block">Taxi ID</label>
        <input
          type="text"
          value={taxiId}
          onChange={(e) => setTaxiId(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block">Latitude</label>
        <input
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block">Longitude</label>
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Update Location</button>
    </form>
  );
}

export default ManualLocationEntry;
