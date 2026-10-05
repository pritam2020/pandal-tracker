import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';
import { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';

const defaultCenter = [22.5726, 88.3639];

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="user-location-dot"></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const pandalIcon = L.divIcon({
  className: 'pandal-location-marker',
  html: `
    <div class="pandal-location-pin">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22s7-6.1 7-12A7 7 0 0 0 5 10c0 5.9 7 12 7 12Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    </div>
  `,
  iconSize: [34, 40],
  iconAnchor: [17, 40],
});

function LocationController({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) {
      return;
    }

    map.setView(
      [location.latitude, location.longitude],
      14
    );
  }, [location, map]);

  return null;
}

function distanceInKm(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

function formatDistance(distance) {
  if (distance == null) {
    return null;
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(1)} km`;
}

export default function PandalMap({
  pandals,
  userLocation,
  progressMap,
  onToggleVisited,
}) {
  const [selectedPandal, setSelectedPandal] = useState(null);

  const mappedPandals = pandals
    .filter(
      (pandal) =>
        Number.isFinite(Number(pandal.latitude)) &&
        Number.isFinite(Number(pandal.longitude))
    )
    .map((pandal) => {
      const latitude = Number(pandal.latitude);
      const longitude = Number(pandal.longitude);

      const distance = userLocation
        ? distanceInKm(
            userLocation.latitude,
            userLocation.longitude,
            latitude,
            longitude
          )
        : null;

      return {
        ...pandal,
        latitude,
        longitude,
        distance,
      };
    })
    .sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;

      return a.distance - b.distance;
    });

  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

  const selectedProgress = selectedPandal
    ? progressMap[selectedPandal._id] || {
        visited: false,
        note: '',
      }
    : null;

  return (
    <div className="pandal-map-wrapper">
      <MapContainer
        center={center}
        zoom={13}
        className="pandal-map"
        zoomControl={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationController location={userLocation} />

        {userLocation && (
          <Marker
            position={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
            icon={userIcon}
          >
            <Popup>
              <strong>Your current location</strong>
            </Popup>
          </Marker>
        )}

        {mappedPandals.map((pandal) => {
          const visited = Boolean(
            progressMap[pandal._id]?.visited
          );

          return (
            <Marker
              key={pandal._id}
              position={[
                pandal.latitude,
                pandal.longitude,
              ]}
              icon={pandalIcon}
              eventHandlers={{
                click: () => setSelectedPandal(pandal),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{pandal.name}</strong>

                  {pandal.zone?.name && (
                    <div className="map-popup-zone">
                      {pandal.zone.name}
                    </div>
                  )}

                  {pandal.distance != null && (
                    <div className="map-popup-distance">
                      {formatDistance(pandal.distance)} away
                    </div>
                  )}

                  <div className="map-popup-status">
                    {visited ? '✓ Visited' : '○ Pending'}
                  </div>

                  <button
                    className="map-visit-button"
                    onClick={() =>
                      onToggleVisited(
                        pandal._id,
                        !visited
                      )
                    }
                  >
                    {visited
                      ? 'Mark as pending'
                      : 'Mark as visited'}
                  </button>

                  {pandal.maps && (
                    <a
                      className="map-popup-link"
                      href={pandal.maps}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in Maps →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {selectedPandal && (
        <div className="map-selected-card">
          <button
            className="map-selected-close"
            onClick={() => setSelectedPandal(null)}
            aria-label="Close pandal details"
          >
            ×
          </button>

          <div className="map-selected-content">
            <div>
              <h3>{selectedPandal.name}</h3>

              {selectedPandal.zone?.name && (
                <p>{selectedPandal.zone.name}</p>
              )}

              {selectedPandal.distance != null && (
                <p>
                  {formatDistance(
                    selectedPandal.distance
                  )}{' '}
                  away
                </p>
              )}

              {selectedProgress?.note && (
                <p className="map-selected-note">
                  📝 {selectedProgress.note}
                </p>
              )}
            </div>

            <div className="map-selected-actions">
              <button
                className="map-selected-visit"
                onClick={() =>
                  onToggleVisited(
                    selectedPandal._id,
                    !selectedProgress.visited
                  )
                }
              >
                {selectedProgress.visited
                  ? '✓ Visited'
                  : 'Mark visited'}
              </button>

              {selectedPandal.maps && (
                <a
                  href={selectedPandal.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="map-selected-maps"
                >
                  📍 Open in Maps
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}