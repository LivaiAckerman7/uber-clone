import React, { useEffect, useState, useContext } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { SourceContext } from '@/context/SourceContext';
import { DestinationContext } from '@/context/DestinationContext';

function GoogleMapSection() {
  const containerStyle = {
    width: '100%',
    height: window.innerWidth * 0.45 + 'px'
  };

  const [center, setCenter] = useState({
    lat: 14.6919,
    lng: -17.4474
  });

  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);

  const [map, setMap] = useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);
  const [distance, setDistance] = useState(null); // Ajouté : état pour la distance
  const [midPoint, setMidPoint] = useState(null); // Ajouté : état pour le point à mi-chemin

  useEffect(() => {
    if (source && source.lat && map) {
      map.panTo({
        lat: source.lat,
        lng: source.lng
      });

      setCenter({
        lat: source.lat,
        lng: source.lng
      });
    }

    if (source && source.lat && destination && destination.lat) {
      directionRoute();
      calculateDistance();
    }
  }, [source]);

  useEffect(() => {
    if (destination && destination.lat && map) {
      setCenter({
        lat: destination.lat,
        lng: destination.lng
      });
    }

    if (source && source.lat && destination && destination.lat) {
      directionRoute();
      calculateDistance();
    }
  }, [destination]);

  const directionRoute = () => {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: { lat: source.lat, lng: source.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirectionRoutePoints(result);
      } else {
        console.error('Error');
      }
    });
  };

  const calculateDistance = () => {
    if (source && destination) {
      const dist = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(source.lat, source.lng),
        new google.maps.LatLng(destination.lat, destination.lng)
      );
      const distanceInKm = dist / 1000; // Convert meters to kilometers
      setDistance(distanceInKm); // Mettre à jour l'état de la distance

      // Calculer le point à mi-chemin
      const midLat = (source.lat + destination.lat) / 2;
      const midLng = (source.lng + destination.lng) / 2;
      setMidPoint({ lat: midLat, lng: midLng }); // Mettre à jour l'état du point à mi-chemin
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, [center]);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ mapId: '20e2bc943e4ed81b' }}
    >
      {source && source.lat ? (
        <MarkerF
          position={{ lat: source.lat, lng: source.lng }}
          icon={{
            url: "/maplocalization.png",
            scaledSize: {
              width: 30,
              height: 30
            }
          }}
        >
          <OverlayView
            position={{ lat: source.lat, lng: source.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className='p-2 bg-white font-bold inline-block'>
              <p className='text-black text-[16px]'>{source.label}</p>
            </div>
          </OverlayView>
        </MarkerF>
      ) : null}

      {destination && destination.lat ? (
        <MarkerF
          position={{ lat: destination.lat, lng: destination.lng }}
          icon={{
            url: "/maplocalization.png",
            scaledSize: {
              width: 30,
              height: 30
            }
          }}
        >
          <OverlayView
            position={{ lat: destination.lat, lng: destination.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className='p-2 bg-white font-bold inline-block'>
              <p className='text-black text-[16px]'>{destination.label}</p>
            </div>
          </OverlayView>
        </MarkerF>
      ) : null}

      {distance && midPoint ? (
        <OverlayView
          position={midPoint}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className='  p-2 bg-white font-bold inline-block'>
            <p className='text-black text-[16px]'>Distance: {distance.toFixed(2)} km</p>
          </div>
        </OverlayView>
      ) : null}

      <DirectionsRenderer
        directions={directionRoutePoints}
        options={{
          polylineOptions: {
            strokeColor: '#000',
            strokeWeight: 5
          },
          suppressMarkers: true
        }}
      />
    </GoogleMap>
    
  );
  
}

export default GoogleMapSection;
