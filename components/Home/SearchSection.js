'use client'
import { DestinationContext } from '@/context/DestinationContext';
import { SourceContext } from '@/context/SourceContext';
import { useContext, useState } from 'react';
import CarListOptions from './CarListOptions';
import InputItem from './InputItem';

function SearchSection() {
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null); // Ajouté : état pour stocker la distance
  

  const calculateDistance = () => {
    if (source && destination) {
      const dist = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(source.lat, source.lng),
        new google.maps.LatLng(destination.lat, destination.lng)
      );
      const distanceInKm = dist / 1000; // Convert meters to kilometers
      setDistance(distanceInKm); // Modifié : mise à jour de l'état distance
      console.log(distanceInKm);
    }
  };

  return (
    <div>
      <div className='p-2 md:p-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Chercher un taxi</p>

        <InputItem type='source' />
        <InputItem type='destination' />

        <button className='p-3 bg-black w-full mt-5 text-white rounded-lg'
          onClick={calculateDistance}>Rechercher</button>
      </div>

      {distance ? ( // Modifié : ajout de la condition pour afficher la distance
        <div className='p-2 bg-white font-bold inline-block mt-5'>
          <p className='text-black text-[16px]'>Distance: {distance.toFixed(2)} km</p> 
        </div>
      ) : null}

      {distance ? <CarListOptions distance={distance} /> : null} 
    </div>
  )
}

export default SearchSection;
