import React, { useEffect, useState, useContext } from 'react';
import { SourceContext } from '../../../../context/SourceContext';

function DriverInterface() {
  const { source, setSource } = useContext(SourceContext);
  const [status, setStatus] = useState('disponible');

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSource({ lat: latitude, lng: longitude, label: 'Ma position' });
      },
      (error) => {
        console.error("Error getting location", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setSource]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // Logique pour mettre à jour le statut du chauffeur dans la base de données
  };

  return (
    <div>
      <div className='p-2 md:p-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Interface Chauffeur</p>
        <div className='mt-5'>
          <p>Statut actuel : <strong>{status}</strong></p>
          <button className='p-3 bg-green-500 w-full mt-5 text-white rounded-lg' onClick={() => handleStatusChange('disponible')}>
            Disponible
          </button>
          <button className='p-3 bg-red-500 w-full mt-5 text-white rounded-lg' onClick={() => handleStatusChange('occupé')}>
            Occupé
          </button>
        </div>
      </div>
    </div>
  );
}

export default DriverInterface;
