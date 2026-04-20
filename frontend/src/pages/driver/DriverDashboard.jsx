



// import { useEffect, useMemo, useState } from "react";
// import socket from "../../socket";
// import api from "../../api/api";
// import DriverLiveMap from "./DriverLiveMap";
// import "../../styles/Driver.css";

// function DriverDashboard() {
//   const [activeOrders, setActiveOrders] = useState([]);
//   const [completedOrders, setCompletedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [driverPos, setDriverPos] = useState(null);
//   const [showMap, setShowMap] = useState(false);

//   const fetchActiveOrders = async () => {
//     const res = await api.get("/driver/my-orders");
//     setActiveOrders(res.data.orders || []);
//   };

//   const fetchCompletedOrders = async () => {
//     const res = await api.get("/driver/completed-orders");
//     setCompletedOrders(res.data.orders || []);
//   };

//   const fetchAllOrders = async () => {
//     try {
//       await Promise.all([fetchActiveOrders(), fetchCompletedOrders()]);
//     } catch (error) {
//       console.log("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (orderId, status) => {
//     try {
//       setUpdatingId(orderId);
//       await api.put(`/driver/order/status/${orderId}`, { status });
//       await fetchAllOrders();
//     } catch (error) {
//       alert(error?.response?.data?.message || "Update failed ❌");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   useEffect(() => {
//     fetchAllOrders();

//     socket.connect();
//     socket.on("orderUpdated", fetchAllOrders);

//     return () => {
//       socket.off("orderUpdated", fetchAllOrders);
//     };
//   }, []);

//   const trackingOrder = useMemo(() => {
//     if (!activeOrders?.length) return null;

//     const rank = (status) => {
//       const s = (status || "").toLowerCase();
//       if (s === "intransit") return 3;
//       if (s === "pickedup") return 2;
//       if (s === "assigned") return 1;
//       return 0;
//     };

//     return [...activeOrders].sort((a, b) => rank(b.status) - rank(a.status))[0];
//   }, [activeOrders]);

//   useEffect(() => {
//     if (!trackingOrder?._id) return;

//     const st = (trackingOrder.status || "").toLowerCase();
//     const trackable = ["assigned", "pickedup", "intransit"].includes(st);
//     if (!trackable) return;

//     const orderId = trackingOrder._id;

//     socket.connect();
//     socket.emit("joinOrderRoom", orderId);

//     if (!navigator.geolocation) {
//       console.log("Geolocation not supported");
//       return () => {
//         socket.emit("leaveOrderRoom", orderId);
//       };
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         const livePos = [pos.coords.latitude, pos.coords.longitude];
//         setDriverPos(livePos);

//         socket.emit("driverLocationUpdate", {
//           orderId,
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       (err) => {
//         console.log("GPS error:", err);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 2000,
//         timeout: 10000,
//       }
//     );

//     return () => {
//       navigator.geolocation.clearWatch(watchId);
//       socket.emit("leaveOrderRoom", orderId);
//     };
//   }, [trackingOrder?._id, trackingOrder?.status]);

//   const renderActionButton = (order) => {
//     const disabled = updatingId === order._id;
//     const status = order.status?.toLowerCase();

//     if (status === "assigned") {
//       return (
//         <button
//           disabled={disabled}
//           onClick={() => updateStatus(order._id, "PickedUp")}
//           className="btn btn-blue"
//         >
//           {disabled ? "Updating..." : "Pickup Order"}
//         </button>
//       );
//     }

//     if (status === "pickedup") {
//       return (
//         <button
//           disabled={disabled}
//           onClick={() => updateStatus(order._id, "InTransit")}
//           className="btn btn-yellow"
//         >
//           {disabled ? "Updating..." : "Start Delivery"}
//         </button>
//       );
//     }

//     if (status === "intransit") {
//       return (
//         <button
//           disabled={disabled}
//           onClick={() => updateStatus(order._id, "Delivered")}
//           className="btn btn-orange"
//         >
//           {disabled ? "Updating..." : "Mark Delivered"}
//         </button>
//       );
//     }

//     return null;
//   };

//   if (loading) {
//     return <h2 style={{ textAlign: "center" }}>Loading orders...</h2>;
//   }

//   const pickupPos = trackingOrder?.pickup
//     ? [trackingOrder.pickup.lat, trackingOrder.pickup.lng]
//     : null;

//   const dropPos = trackingOrder?.drop
//     ? [trackingOrder.drop.lat, trackingOrder.drop.lng]
//     : null;

//   return (
//     <div className="driver-container">
//       <h1 className="dashboard-title">Driver Dashboard</h1>

//       {trackingOrder?._id && (
//         <div className="tracking-banner">
//           📍 Live route active for: <b>{trackingOrder._id}</b> ({trackingOrder.status})
//         </div>
//       )}

//       {trackingOrder && (
//         <div className="driver-map-section">
//           <h2 className="section-title">Live Route</h2>
//           <DriverLiveMap
//             driverPos={driverPos}
//             pickupPos={pickupPos}
//             dropPos={dropPos}
//           />

//           <div className="driver-map-info">
//             <p><strong>Pickup:</strong> {trackingOrder.pickup?.address || "N/A"}</p>
//             <p><strong>Drop:</strong> {trackingOrder.drop?.address || "N/A"}</p>
//             <p><strong>Status:</strong> {trackingOrder.status}</p>
//             <p>
//               <strong>Live Position:</strong>{" "}
//               {driverPos
//                 ? `${driverPos[0].toFixed(5)}, ${driverPos[1].toFixed(5)}`
//                 : "Waiting for GPS..."}
//             </p>
//           </div>
//         </div>
//       )}

//       <h2 className="section-title">Active Orders</h2>

//       {activeOrders.length === 0 ? (
//         <p className="empty-text">No active orders</p>
//       ) : (
//         <div className="orders-grid">
//           {activeOrders.map((order) => (
//             <div key={order._id} className="order-card">
//               <p><strong>Order ID:</strong> {order._id}</p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 <span className={`status ${order.status?.toLowerCase()}`}>
//                   {order.status}
//                 </span>
//               </p>
//               <div className="action-area">{renderActionButton(order)}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       <h2 className="section-title completed-title">Completed Orders</h2>

//       {completedOrders.length === 0 ? (
//         <p className="empty-text">No completed orders</p>
//       ) : (
//         <div className="orders-grid">
//           {completedOrders.map((order) => (
//             <div key={order._id} className="order-card completed-card">
//               <p><strong>Order ID:</strong> {order._id}</p>
//               <span className="status-delivered">✅ Delivered</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default DriverDashboard;






import { useEffect, useMemo, useState } from "react";
import socket from "../../socket";
import api from "../../api/api";
import DriverLiveMap from "./DriverLiveMap";
import "../../styles/Driver.css";

function DriverDashboard() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const fetchActiveOrders = async () => {
    const res = await api.get("/driver/my-orders");
    setActiveOrders(res.data.orders || []);
  };

  const fetchCompletedOrders = async () => {
    const res = await api.get("/driver/completed-orders");
    setCompletedOrders(res.data.orders || []);
  };

  const fetchAllOrders = async () => {
    try {
      await Promise.all([fetchActiveOrders(), fetchCompletedOrders()]);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/driver/order/status/${orderId}`, { status });
      await fetchAllOrders();
    } catch (error) {
      alert(error?.response?.data?.message || "Update failed ❌");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();

    socket.connect();
    socket.on("orderUpdated", fetchAllOrders);

    return () => {
      socket.off("orderUpdated", fetchAllOrders);
    };
  }, []);

  const trackingOrder = useMemo(() => {
    if (!activeOrders?.length) return null;

    const rank = (status) => {
      const s = (status || "").toLowerCase();
      if (s === "intransit") return 3;
      if (s === "pickedup") return 2;
      if (s === "assigned") return 1;
      return 0;
    };

    return [...activeOrders].sort((a, b) => rank(b.status) - rank(a.status))[0];
  }, [activeOrders]);

  useEffect(() => {
    if (!trackingOrder?._id) return;

    const st = (trackingOrder.status || "").toLowerCase();
    const trackable = ["assigned", "pickedup", "intransit"].includes(st);
    if (!trackable) return;

    const orderId = trackingOrder._id;

    socket.connect();
    socket.emit("joinOrderRoom", orderId);

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return () => {
        socket.emit("leaveOrderRoom", orderId);
      };
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const livePos = [pos.coords.latitude, pos.coords.longitude];
        setDriverPos(livePos);

        socket.emit("driverLocationUpdate", {
          orderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.log("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.emit("leaveOrderRoom", orderId);
    };
  }, [trackingOrder?._id, trackingOrder?.status]);

  const renderActionButton = (order) => {
    const disabled = updatingId === order._id;
    const status = order.status?.toLowerCase();

    if (status === "assigned") {
      return (
        <button
          disabled={disabled}
          onClick={() => updateStatus(order._id, "PickedUp")}
          className="btn btn-blue"
        >
          {disabled ? "Updating..." : "Pickup Order"}
        </button>
      );
    }

    if (status === "pickedup") {
      return (
        <button
          disabled={disabled}
          onClick={() => updateStatus(order._id, "InTransit")}
          className="btn btn-yellow"
        >
          {disabled ? "Updating..." : "Start Delivery"}
        </button>
      );
    }

    if (status === "intransit") {
      return (
        <button
          disabled={disabled}
          onClick={() => updateStatus(order._id, "Delivered")}
          className="btn btn-orange"
        >
          {disabled ? "Updating..." : "Mark Delivered"}
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading orders...</h2>;
  }

  const pickupPos = trackingOrder?.pickup
    ? [trackingOrder.pickup.lat, trackingOrder.pickup.lng]
    : null;

  const dropPos = trackingOrder?.drop
    ? [trackingOrder.drop.lat, trackingOrder.drop.lng]
    : null;

  return (
    <div className="driver-container">
      <h1 className="dashboard-title">Driver Dashboard</h1>

      {trackingOrder?._id && (
        <div className="tracking-banner uber-banner">
          <div>
            <p className="uber-banner-label">Live route active</p>
            <h3 className="uber-banner-id">
              Order #{trackingOrder._id.slice(-6)}
            </h3>
            <p className="uber-banner-sub">
              {trackingOrder.status} •{" "}
              {driverPos
                ? `${driverPos[0].toFixed(5)}, ${driverPos[1].toFixed(5)}`
                : "Waiting for GPS..."}
            </p>
          </div>

          <button
            className="open-map-btn uber-open-btn"
            onClick={() => setShowMap(true)}
          >
            📍 Open Live Map
          </button>
        </div>
      )}

      {showMap && trackingOrder && (
        <div className="map-modal">
          <div className="map-modal-content uber-map-modal">
            <div className="uber-map-topbar">
              <div>
                <p className="uber-map-small">Current Delivery</p>
                <h3 className="uber-map-title">
                  Order #{trackingOrder._id.slice(-6)}
                </h3>
                <p className="uber-map-sub">
                  {trackingOrder.status} •{" "}
                  {trackingOrder.drop?.address || "No destination"}
                </p>
              </div>

              <button
                className="close-map-btn"
                onClick={() => setShowMap(false)}
              >
                ✕
              </button>
            </div>

            <div className="uber-map-wrapper">
              <DriverLiveMap
                driverPos={driverPos}
                pickupPos={pickupPos}
                dropPos={dropPos}
              />
            </div>

            <div className="uber-map-bottom">
              <div className="uber-info-chip">
                <span>📍 Pickup</span>
                <p>{trackingOrder.pickup?.address || "N/A"}</p>
              </div>

              <div className="uber-info-chip">
                <span>🏁 Drop</span>
                <p>{trackingOrder.drop?.address || "N/A"}</p>
              </div>

              <div className="uber-info-chip">
                <span>🛰 Live Position</span>
                <p>
                  {driverPos
                    ? `${driverPos[0].toFixed(5)}, ${driverPos[1].toFixed(5)}`
                    : "Waiting for GPS..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="section-title">Active Orders</h2>

      {activeOrders.length === 0 ? (
        <p className="empty-text">No active orders</p>
      ) : (
        <div className="orders-grid">
          {activeOrders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              <div className="action-area">{renderActionButton(order)}</div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title completed-title">Completed Orders</h2>

      {completedOrders.length === 0 ? (
        <p className="empty-text">No completed orders</p>
      ) : (
        <div className="orders-grid">
          {completedOrders.map((order) => (
            <div key={order._id} className="order-card completed-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <span className="status-delivered">✅ Delivered</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;