import { useCallback } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718
};

export function GoogleMapComponent({ onLocationSelect }) {
  const handleMapClick = useCallback((e) => {
    if (e.latLng) {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      onLocationSelect(newLocation);
    }
  }, [onLocationSelect]);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerClassName="w-full h-[300px] rounded-lg"
        center={defaultCenter}
        zoom={8}
        onClick={handleMapClick}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
}