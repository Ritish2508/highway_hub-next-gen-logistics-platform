import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import api from "../../api/api";
import socket from "../../socket";
import "../../styles/Owner.css";

// leaflet marker fix
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
  const routingRef = useMemo(() => ({ current: null }), []);

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
        styles: [{ color: "#2563eb", weight: 5 }],
      },
      createMarker: () => null,
    }).addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };
  }, [map, from, to, routingRef]);

  return null;
}

export default function OwnerTrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [loading, setLoading] = useState(true);

  const pickupPos = useMemo(() => {
    if (!order?.pickup?.lat) return null;
    return [order.pickup.lat, order.pickup.lng];
  }, [order]);

  const dropPos = useMemo(() => {
    if (!order?.drop?.lat) return null;
    return [order.drop.lat, order.drop.lng];
  }, [order]);

  const center = driverPos || pickupPos || [26.8467, 80.9462];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/owner/track/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to load tracking");
        navigate("/owner/my-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinOrderRoom", orderId);

    const onDriverLocation = (data) => {
      if (!data || data.orderId !== orderId) return;
      setDriverPos([data.lat, data.lng]);
    };

    socket.on("driverLocation", onDriverLocation);

    return () => {
      socket.emit("leaveOrderRoom", orderId);
      socket.off("driverLocation", onDriverLocation);
    };
  }, [orderId]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading tracking...</h2>;
  if (!order) return null;

  return (
    <div className="owner-track-page">
      <div className="owner-track-header">
        <button className="owner-track-back" onClick={() => navigate("/owner/my-orders")}>
          ← Back
        </button>

        <div>
          <h2>📍 Track Order</h2>
          <p className="owner-track-sub">
            <b>Status:</b> {order.status}{" "}
            {order.driver?.driverId ? `| Driver: ${order.driver.driverId}` : "| Driver not assigned yet"}
          </p>
        </div>
      </div>

      <div className="owner-track-map">
        <MapContainer center={center} zoom={13} style={{ height: "420px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {pickupPos && <Marker position={pickupPos} />}
          {dropPos && <Marker position={dropPos} />}
          {driverPos && <Marker position={driverPos} />}

          {driverPos && dropPos ? (
            <RoutingMachine from={driverPos} to={dropPos} />
          ) : pickupPos && dropPos ? (
            <RoutingMachine from={pickupPos} to={dropPos} />
          ) : null}
        </MapContainer>
      </div>

      <div className="owner-track-info">
        <div className="owner-track-card">
          <p><b>User:</b> {order.user?.name || "N/A"}</p>
          <p><b>Phone:</b> {order.user?.phone || "N/A"}</p>
          <p><b>Pickup:</b> {order.pickup?.address || "N/A"}</p>
          <p><b>Drop:</b> {order.drop?.address || "N/A"}</p>
          <p><b>Goods:</b> {order.goodsType}</p>
          <p><b>Weight:</b> {order.weight} kg</p>
          <p><b>Distance:</b> {order.distanceKm ? `${order.distanceKm} km` : "N/A"}</p>
  <p><b>ETA:</b> {order.estimatedDurationMin ? `${order.estimatedDurationMin} min` : "N/A"}</p>
  <p><b>Fare:</b> {order.fare ? `₹${order.fare}` : "N/A"}</p>
          <p>
            <b>Live Driver:</b>{" "}
            {driverPos
              ? `${driverPos[0].toFixed(5)}, ${driverPos[1].toFixed(5)}`
              : "Waiting for location..."}
          </p>
        </div>
      </div>
    </div>
  );
}