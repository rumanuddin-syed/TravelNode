import React from "react";
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
};

const center = { lat: 19.076, lng: 72.8777 }; // Default: Mumbai

function RouteMap({ origin, destination, waypoints = [] }) {
  const [directions, setDirections] = React.useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY || ""
  });

  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
    }
  };

  if (!isLoaded) return <div className="w-full h-[400px] bg-forest-50 animate-pulse rounded-xl flex items-center justify-center text-forest-300">Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      {origin && destination && (
        <DirectionsService
          options={{
            origin,
            destination,
            waypoints,
            travelMode: "DRIVING",
          }}
          callback={directionsCallback}
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}

export default React.memo(RouteMap);
