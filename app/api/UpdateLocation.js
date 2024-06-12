import React, { useEffect } from 'react';

const UpdateLocation = ({ userId }) => {
    useEffect(() => {
        const updateLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const response = await fetch('/api/updateUserLocation', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId,
                                    lat: latitude,
                                    lng: longitude,
                                }),
                            });
                            if (!response.ok) {
                                console.error('Failed to update location');
                            }
                        } catch (error) {
                            console.error('Error updating location:', error);
                        }
                    },
                    (error) => {
                        console.error('Error getting location', error);
                    },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        updateLocation();

    }, [userId]);

    return null;
};

export default UpdateLocation;
