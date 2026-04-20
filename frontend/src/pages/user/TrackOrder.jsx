// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
// import L from "leaflet";
// import api from "../../api/api";
// import socket from "../../socket";
// import "../../styles/User.css";

// // ✅ Fix marker icons (Vite/React)
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// export default function TrackOrder() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [driverPos, setDriverPos] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const pickupPos = useMemo(() => {
//     if (!order?.pickup?.lat) return null;
//     return [order.pickup.lat, order.pickup.lng];
//   }, [order]);

//   const dropPos = useMemo(() => {
//     if (!order?.drop?.lat) return null;
//     return [order.drop.lat, order.drop.lng];
//   }, [order]);

//   const center = driverPos || pickupPos || [26.8467, 80.9462];

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await api.get(`/user/order/${orderId}`);
//         setOrder(res.data.order);
//       } catch (err) {
//         alert(err?.response?.data?.message || "Failed to load order");
//         navigate("/user/orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   useEffect(() => {
//     socket.connect();
//     socket.emit("joinOrderRoom", orderId);

//     const onDriverLocation = (data) => {
//       if (!data || data.orderId !== orderId) return;
//       setDriverPos([data.lat, data.lng]);
//     };

//     socket.on("driverLocation", onDriverLocation);

//     return () => {
//       socket.emit("leaveOrderRoom", orderId);
//       socket.off("driverLocation", onDriverLocation);
//     };
//   }, [orderId]);

//   if (loading) return <h2 style={{ textAlign: "center" }}>Loading tracking...</h2>;
//   if (!order) return null;

//   return (
//     <div className="track-page">
//       <div className="track-header">
//         <button className="back-btn" onClick={() => navigate("/user/orders")}>
//           ← Back
//         </button>
//         <div>
//           <h2 className="track-title">📍 Track Order</h2>
//           <p className="track-sub">
//             <b>Status:</b> {order.status}{" "}
//             {order.driver?.driverId ? `| Driver: ${order.driver.driverId}` : "| Driver not assigned yet"}
//           </p>
//         </div>
//       </div>

//       <div className="track-map">
//         <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {pickupPos && <Marker position={pickupPos} />}
//           {dropPos && <Marker position={dropPos} />}

//           {/* optional straight line */}
//           {pickupPos && dropPos && <Polyline positions={[pickupPos, dropPos]} />}

//           {/* live driver marker */}
//           {driverPos && <Marker position={driverPos} />}
//         </MapContainer>
//       </div>

//       <div className="track-info">
//         <div className="info-card">
//           <p><b>Pickup:</b> {order.pickup?.address || "N/A"}</p>
//           <p><b>Drop:</b> {order.drop?.address || "N/A"}</p>
//           <p><b>Goods:</b> {order.goodsType}</p>
//           <p><b>Weight:</b> {order.weight} kg</p>
//           <p><b>Live Driver:</b> {driverPos ? `${driverPos[0].toFixed(5)}, ${driverPos[1].toFixed(5)}` : "Waiting for location..."}</p>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import api from "../../api/api";
import socket from "../../socket";
import "../../styles/User.css";

// ✅ Fix marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Routing component
function RoutingMachine({ from, to }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    // remove old route
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
      createMarker: () => null, // default routing markers hide
    }).addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
      }
    };
  }, [map, from, to]);

  return null;
}

export default function TrackOrder() {
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
        const res = await api.get(`/user/order/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to load order");
        navigate("/user/orders");
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
    <div className="track-page">
      <div className="track-header">
        <button className="back-btn" onClick={() => navigate("/user/orders")}>
          ← Back
        </button>
        <div>
          <h2 className="track-title">📍 Track Order</h2>
          <p className="track-sub">
            <b>Status:</b> {order.status}{" "}
            {order.driver?.driverId
              ? `| Driver: ${order.driver.driverId}`
              : "| Driver not assigned yet"}
          </p>
        </div>
      </div>

      <div className="track-map">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "420px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {pickupPos && <Marker position={pickupPos} />}
          {dropPos && <Marker position={dropPos} />}
          {driverPos && <Marker position={driverPos} />}

          {/* ✅ Route logic:
              if driver live position exists => driver -> drop
              else fallback => pickup -> drop
          */}
          {driverPos && dropPos ? (
            <RoutingMachine from={driverPos} to={dropPos} />
          ) : pickupPos && dropPos ? (
            <RoutingMachine from={pickupPos} to={dropPos} />
          ) : null}
        </MapContainer>
      </div>

      <div className="track-info">
        <div className="info-card">
          <p><b>Pickup:</b> {order.pickup?.address || "N/A"}</p>
          <p><b>Drop:</b> {order.drop?.address || "N/A"}</p>
          <p><b>Goods:</b> {order.goodsType}</p>
          <p><b>Weight:</b> {order.weight} kg</p>
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