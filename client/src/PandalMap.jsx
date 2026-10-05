import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';
import { useEffect } from 'react';

import 'leaflet/dist/leaflet.css';

const defaultCenter = [22.5726, 88.3639]; // Kolkata

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-location-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const pandalIcon = L.divIcon({
  className: 'pandal-location-marker',
  html: '<div class="pandal-location-pin">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function LocationController({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) {
      return;
    }

    map.setView([location.latitude, location.longitude], 14);
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

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export default function PandalMap({
  pandals,
  userLocation,
}) {
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
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;

      return a.distance - b.distance;
    });

  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="pandal-map"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
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

      {mappedPandals.map((pandal) => (
        <Marker
          key={pandal._id}
          position={[pandal.latitude, pandal.longitude]}
          icon={pandalIcon}
        >
          <Popup>
            <strong>{pandal.name}</strong>

            {pandal.zone?.name && (
              <div>{pandal.zone.name}</div>
            )}

            {pandal.distance !== null && (
              <div>
                {pandal.distance < 1
                  ? `${Math.round(pandal.distance * 1000)} m`
                  : `${pandal.distance.toFixed(1)} km`}
                {' '}away
              </div>
            )}

            {pandal.maps && (
              <a
                href={pandal.maps}
                target="_blank"
                rel="noreferrer"
              >
                Open Maps
              </a>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}