import React, { useEffect, useState, useContext } from 'react';
import { DirectionsRenderer, GoogleMap, Marker, OverlayView } from '@react-google-maps/api';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
}); // Assurez-vous que l'URL correspond à votre serveur

function GoogleMapSection() {
  const containerStyle = {
    width: '100%',
    height: window.innerWidth * 0.45 + 'px'
  };

  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);

  const [center, setCenter] = useState({
    lat: 14.6919,
    lng: -17.4474
  });

  const [map, setMap] = useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);
  const [distance, setDistance] = useState(null);
  const [midPoint, setMidPoint] = useState(null);
  const [taxis, setTaxis] = useState([]);

  const fetchNearbyTaxis = async (lat, lng) => {
    try {
      const response = await fetch('http://localhost:5000/nearby-taxis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lng, radius: 5000 }), // radius in meters
      });

      const data = await response.json();
      console.log('Nearby taxis:', data); // Debug log
      setTaxis(data);
    } catch (error) {
      console.error('Error fetching nearby taxis:', error);
    }
  };

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

      fetchNearbyTaxis(source.lat, source.lng);
    }

    if (source && source.lat && destination && destination.lat) {
      directionRoute();
      calculateDistance();
    }
  }, [source, map, destination]);

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
  }, [destination, map, source]);

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
      const distanceInKm = dist / 1000;
      setDistance(distanceInKm);

      const midLat = (source.lat + destination.lat) / 2;
      const midLng = (source.lng + destination.lng) / 2;
      setMidPoint({ lat: midLat, lng: midLng });
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

  const handleTaxiClick = (taxi) => {
    // Envoyer la demande de course au chauffeur via Socket.IO
    socket.emit('ride-request', {
      driver_id: taxi.driver_id,
      client: 'Client Name', // Remplacez par le nom réel du client
      source: source,
      destination: destination
    });

    alert(`Demande de course envoyée au chauffeur ${taxi.name}`);
  };

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
        <Marker
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
        </Marker>
      ) : null}

      {destination && destination.lat ? (
        <Marker
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
        </Marker>
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

      {taxis.map((taxi, index) => (
        <Marker
          key={index}
          position={{ lat: taxi.latitude, lng: taxi.longitude }}
          icon={{
            url: "/taxi.png",
            scaledSize: {
              width: 40,
              height: 40
            }
          }}
          onClick={() => handleTaxiClick(taxi)}
        >
          <OverlayView
            position={{ lat: taxi.latitude, lng: taxi.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className='p-2 bg-yellow-500 font-bold inline-block'>
              <p className='text-black text-[16px]'>{taxi.name}</p>
            </div>
          </OverlayView>
        </Marker>
      ))}

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