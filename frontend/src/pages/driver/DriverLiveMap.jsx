import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

// marker icons fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RoutingMachine({ from, to }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 6 }],
      },
      createMarker: () => null,
    }).addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };
  }, [map, from, to]);

  return null;
}

export default function DriverLiveMap({ driverPos, dropPos, pickupPos }) {
  const center = driverPos || pickupPos || [26.8467, 80.9462];

  return (
    <div className="driver-live-map">
      <MapContainer
  center={center}
  zoom={13}
  style={{ height: "100%", width: "100%" }}
>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pickupPos && <Marker position={pickupPos} />}
        {dropPos && <Marker position={dropPos} />}
        {driverPos && <Marker position={driverPos} />}

        {driverPos && dropPos ? (
          <RoutingMachine from={driverPos} to={dropPos} />
        ) : null}
      </MapContainer>
    </div>
  );
}