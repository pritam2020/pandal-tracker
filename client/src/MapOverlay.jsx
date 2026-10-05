import { useEffect, useState } from 'react';
import PandalMap from './PandalMap';

export default function MapOverlay({ pandals, onClose }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('loading');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationStatus('success');
      },
      (error) => {
        console.error('Location error:', error);
        setLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return (
    <div className="map-overlay">
      <div className="map-overlay-header">
        <button
          className="map-close-button"
          onClick={onClose}
          aria-label="Close map"
        >
          ×
        </button>

        <div>
          <h2>Pandal Map</h2>

          {locationStatus === 'loading' && (
            <p>Finding your location...</p>
          )}

          {locationStatus === 'success' && (
            <p>Your current location</p>
          )}

          {locationStatus === 'denied' && (
            <p>Location unavailable</p>
          )}

          {locationStatus === 'unsupported' && (
            <p>Location is not supported</p>
          )}
        </div>
      </div>

      <div className="map-container">
        <PandalMap
          pandals={pandals}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
}