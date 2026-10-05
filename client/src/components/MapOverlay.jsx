import { useState } from 'react';
import PandalMap from './PandalMap';

export default function MapOverlay({
  pandals,
  progressMap,
  onToggleVisited,
  onClose,
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');

  const findNearMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    setLocationStatus('loading');

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
  };

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

        <div className="map-overlay-title">
          <h2>Pandal Map</h2>

          {locationStatus === 'idle' && (
            <p>Explore pandals on the map</p>
          )}

          {locationStatus === 'loading' && (
            <p>Finding your location...</p>
          )}

          {locationStatus === 'success' && (
            <p>Showing pandals near you</p>
          )}

          {locationStatus === 'denied' && (
            <p>Location unavailable — map still works</p>
          )}

          {locationStatus === 'unsupported' && (
            <p>Location is not supported</p>
          )}
        </div>

        <button
          className={`near-me-button ${
            locationStatus === 'success' ? 'active' : ''
          }`}
          onClick={findNearMe}
          disabled={locationStatus === 'loading'}
        >
          <span className="near-me-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="8" />
            </svg>
          </span>

          <span>
            {locationStatus === 'loading'
              ? 'Finding...'
              : 'Near Me'}
          </span>
        </button>
      </div>

      <div className="map-container">
        <PandalMap
          pandals={pandals}
          userLocation={userLocation}
          progressMap={progressMap}
          onToggleVisited={onToggleVisited}
        />
      </div>
    </div>
  );
}