import React, { useContext } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { SourceContext } from '../../../../context/SourceContext';

const libraries = ['places'];

function DriverMap() {
  const { source } = useContext(SourceContext);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
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
  );
}

export default DriverMap;
