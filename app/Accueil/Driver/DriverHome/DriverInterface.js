import React, { useEffect, useState, useContext } from 'react';
import { SourceContext } from '../../../../context/SourceContext';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

function DriverInterface() {
  const { source, setSource } = useContext(SourceContext);
  const [status, setStatus] = useState('disponible');
  const [messages, setMessages] = useState([]);
  const driver_id = 1; // Utilisez l'ID réel du chauffeur

  useEffect(() => {
    const updatePosition = (position) => {
      const { latitude, longitude } = position.coords;
      setSource({ lat: latitude, lng: longitude, label: 'Ma position' });

      // Envoyer la position mise à jour au serveur
      fetch('http://localhost:5000/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver_id: driver_id,
          name: 'Taxi 1',
          latitude: latitude,
          longitude: longitude,
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
  }, [setSource, driver_id]);

  useEffect(() => {
    // Rejoindre la salle du chauffeur
    socket.emit('join', driver_id);

    socket.on('ride-request', (data) => {
      const message = `You have a new ride request from ${data.client} from ${data.source.label} to ${data.destination.label}`;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('ride-request');
    };
  }, [driver_id]);

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
        <div className='mt-5'>
          <p className='text-[16px] font-bold'>Messages :</p>
          <div className='bg-gray-100 p-3 rounded-lg h-32 overflow-y-auto'>
            {messages.length === 0 ? (
              <p className='text-gray-500'>Aucun message</p>
            ) : (
              messages.map((message, index) => (
                <p key={index} className='text-black text-[14px]'>{message}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverInterface;
