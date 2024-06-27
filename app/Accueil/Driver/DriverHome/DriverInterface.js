import React, { useEffect, useState, useContext } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { SourceContext } from '../../../../context/SourceContext';

const libraries = ['places'];

function DriverInterface() {
  const { source, setSource } = useContext(SourceContext);
  const [status, setStatus] = useState('disponible');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    const updatePosition = (position) => {
      const { latitude, longitude } = position.coords;
      setSource({ lat: latitude, lng: longitude });

      // Envoyer la position mise à jour au serveur
      fetch('http://localhost:5000/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver_id: 1, // Utilise l'ID réel du chauffeur
          name: 'Taxi 1',
          latitude: latitude,
          longitude: longitude,
          status: status
        }),
      }).catch(error => console.error('Error updating location:', error));
    };

    const watchId = navigator.geolocation.watchPosition(
      updatePosition,
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
  }, [setSource, status]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

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
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={{ lat: source.lat || 14.6919, lng: source.lng || -17.4474 }}
        zoom={15}
      >
        {source && source.lat && (
          <MarkerF
            position={{ lat: source.lat, lng: source.lng }}
            icon={{
              url: "/car-icon.png", // Utilise l'icône du taxi
              scaledSize: {
                width: 30,
                height: 30
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default DriverInterface;
