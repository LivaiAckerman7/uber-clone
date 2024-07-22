'use client';
import { DestinationContext } from '../../context/DestinationContext';
import { SourceContext } from '../../context/SourceContext';
import { useContext, useState, useEffect } from 'react';
import CarListOptions from './CarListOptions';
import InputItem from './InputItem';

function SearchSection() {
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    console.log('Source:', source);
    console.log('Destination:', destination);
  }, [source, destination]);

  const calculateDistance = () => {
    if (source && destination && source.lat && source.lng && destination.lat && destination.lng) {
      const dist = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(source.lat, source.lng),
        new google.maps.LatLng(destination.lat, destination.lng)
      );
      const distanceInKm = dist / 1000;
      setDistance(distanceInKm);
      console.log('Distance (km):', distanceInKm);
    } else {
      console.error('Invalid source or destination coordinates:', source, destination);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSource({ lat: latitude, lng: longitude, label: 'Ma position' });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <div className='p-2 md:p-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Chercher un taxi</p>
         
        <button className='p-3 bg-black w-full mt-5 text-white rounded-lg' onClick={handleUseMyLocation}>
          Voir position
        </button>

        <InputItem type='source' />
        <InputItem type='destination' />

        <button className='p-3 bg-black w-full mt-5 text-white rounded-lg' onClick={calculateDistance}>
          Rechercher
        </button>
      </div>

      {distance !== null && (
        <div className='p-2 bg-white font-bold inline-block mt-5'>
          <p className='text-black text-[16px]'>Distance: {distance.toFixed(2)} km</p> 
        </div>
      )}

      {distance !== null && <CarListOptions distance={distance} />} 
    </div>
  );
}

export default SearchSection;
