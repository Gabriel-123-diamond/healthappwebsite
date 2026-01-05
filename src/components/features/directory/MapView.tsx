"use client";

import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { DirectoryItem } from "@/types/directory";

interface MapViewProps {
  items: DirectoryItem[];
  center?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

export function MapView({ items, center = defaultCenter }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selected, setSelected] = useState<DirectoryItem | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-full bg-gray-100 animate-pulse rounded-3xl" />;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: mapStyles, // Minimalist health-focused theme
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      {items.map((item) => (
        <MarkerF
          key={item.id}
          position={item.location}
          onClick={() => setSelected(item)}
          icon={{
            url: item.type === "hospital" ? "/icons/hospital-pin.png" : item.type === "herbalist" ? "/icons/herbal-pin.png" : "/icons/doctor-pin.png",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      ))}

      {selected && (
        <InfoWindowF
          position={selected.location}
          onCloseClick={() => setSelected(null)}
        >
          <div className="p-2 max-w-[200px]">
            <h4 className="font-bold text-gray-900">{selected.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{selected.specialty}</p>
            <p className="text-xs font-semibold text-blue-600 mt-1">{selected.phone}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

const mapStyles = [
  {
    featureType: "poi.medical",
    elementType: "geometry",
    stylers: [{ color: "#f1f8e9" }],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#444444" }],
  },
  // Add more custom styles for a clean medical look
];
