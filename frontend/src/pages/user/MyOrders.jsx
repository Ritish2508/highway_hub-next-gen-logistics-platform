

// import { useEffect, useState } from "react";
// import api from "../../api/api";
// import { useNavigate } from "react-router-dom";
// import "../../styles/User.css";

// const MyOrders = () => {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancellingId, setCancellingId] = useState(null);

//   const fetchOrders = async () => {
//     try {
//       const res = await api.get("/user/my-orders");
//       setOrders(res.data.orders || []);
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         alert("Session expired. Login again.");
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const normalizeStatus = (status) =>
//     (status || "").toLowerCase().replace(/\s+/g, "");

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "#f59e0b";
//       case "Accepted":
//         return "#3b82f6";
//       case "Assigned":
//         return "#8b5cf6";
//       case "PickedUp":
//         return "#0ea5e9";
//       case "InTransit":
//         return "#6366f1";
//       case "Delivered":
//         return "#22c55e";
//       case "Cancelled":
//         return "#ef4444";
//       default:
//         return "gray";
//     }
//   };

//   // ✅ Track only after driver assigned + moving
//   const canTrack = (status) => {
//     const s = normalizeStatus(status);
//     return ["assigned", "pickedup", "intransit"].includes(s);
//   };

//   // ✅ View details after Accepted (or later)
//   const canViewDetails = (status) => {
//     const s = normalizeStatus(status);
//     return ["accepted", "assigned", "pickedup", "intransit", "delivered", "cancelled"].includes(s);
//   };

//   // ✅ Cancel allowed: Pending OR Accepted (only if driver not assigned)
//   const canCancel = (order) => {
//     const s = normalizeStatus(order.status);
//     const driverAssigned = !!order.driver;
//     return s === "pending" || (s === "accepted" && !driverAssigned);
//   };

//   const handleCancel = async (orderId) => {
//     const ok = window.confirm("Cancel this order?");
//     if (!ok) return;

//     try {
//       setCancellingId(orderId);
//       await api.put(`/user/cancel/${orderId}`);
//       await fetchOrders();
//       alert("✅ Order cancelled");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Cancel failed");
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   if (loading) return <h2 style={{ textAlign: "center" }}>Loading orders...</h2>;

//   return (
//     <div className="orders-page">
//       <div className="orders-header">
//         <h2>📦 My Orders</h2>

//         <button onClick={() => navigate("/user/place-order")}>
//           + Place Order
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <div className="empty-state">
//           <h3>No orders yet</h3>
//           <p>Start by placing your first order 🚚</p>
//         </div>
//       ) : (
//         <div className="orders-grid">
//           {orders.map((order) => {
//             const status = normalizeStatus(order.status);
//             const isDelivered = status === "delivered";
//             const isCancelled = status === "cancelled";

//             const trackEnabled = canTrack(order.status);
//             const showCancel = canCancel(order);
//             const showDetails = canViewDetails(order.status);

//             return (
//               <div key={order._id} className="order-card">
//                 <p>
//                   <strong>Pickup:</strong>{" "}
//                   {order.pickup?.address || order.pickupLocation || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Drop:</strong>{" "}
//                   {order.drop?.address || order.dropLocation || "N/A"}
//                 </p>
//                 <p><strong>Goods:</strong> {order.goodsType}</p>
//                 <p><strong>Weight:</strong> {order.weight} kg</p>

//                 <div className="order-footer">
//   <span
//     className="status-badge"
//     style={{ background: getStatusColor(order.status) }}
//   >
//     {order.status}
//   </span>

//   <div className="order-actions-wrapper">
//     {/* 🔹 TOP ROW */}
//     <div className="order-actions-top">
//       {showDetails && (
//         <button
//           className="details-btn"
//           onClick={() => navigate(`/user/order/${order._id}`)}
//         >
//           👁 View Details
//         </button>
//       )}

//       {showCancel && (
//         <button
//           className="cancel-btn"
//           disabled={cancellingId === order._id}
//           onClick={() => handleCancel(order._id)}
//         >
//           {cancellingId === order._id ? "Cancelling..." : "❌ Cancel"}
//         </button>
//       )}
//     </div>

//     {/* 🔹 BOTTOM ROW */}
//     {!isDelivered && !isCancelled && (
//       <div className="order-actions-bottom">
//         <button
//           className="track-btn"
//           disabled={!trackEnabled}
//           onClick={() => navigate(`/user/track/${order._id}`)}
//         >
//           📍 Track Order
//         </button>

//         {!trackEnabled && (
//           <small className="track-hint">
//             ⏳ Tracking available after driver assignment
//           </small>
//         )}
//       </div>
//     )}
//   </div>
// </div> 
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrders;






import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/User.css";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/user/my-orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const normalizeStatus = (status) =>
    (status || "").toLowerCase().replace(/\s+/g, "");

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Accepted":
        return "#3b82f6";
      case "Assigned":
        return "#8b5cf6";
      case "PickedUp":
        return "#0ea5e9";
      case "InTransit":
        return "#6366f1";
      case "Delivered":
        return "#22c55e";
      case "Cancelled":
        return "#ef4444";
      default:
        return "gray";
    }
  };

  const canTrack = (status) => {
    const s = normalizeStatus(status);
    return ["assigned", "pickedup", "intransit"].includes(s);
  };

  const canViewDetails = (status) => {
    const s = normalizeStatus(status);
    return [
      "accepted",
      "assigned",
      "pickedup",
      "intransit",
      "delivered",
      "cancelled",
    ].includes(s);
  };

  const canCancel = (order) => {
    const s = normalizeStatus(order.status);
    const driverAssigned = !!order.driver;
    return s === "pending" || (s === "accepted" && !driverAssigned);
  };

  const handleCancel = async (orderId) => {
    const ok = window.confirm("Cancel this order?");
    if (!ok) return;

    try {
      setCancellingId(orderId);
      await api.put(`/user/cancel/${orderId}`);
      await fetchOrders();
      alert("✅ Order cancelled");
    } catch (err) {
      alert(err?.response?.data?.message || "Cancel failed");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading orders...</h2>;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>📦 My Orders</h2>

        <button onClick={() => navigate("/user/place-order")}>
          + Place Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Start by placing your first order 🚚</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const status = normalizeStatus(order.status);
            const isDelivered = status === "delivered";
            const isCancelled = status === "cancelled";

            const trackEnabled = canTrack(order.status);
            const showCancel = canCancel(order);
            const showDetails = canViewDetails(order.status);

            return (
              <div key={order._id} className="order-card">
                <p>
                  <strong>Pickup:</strong>{" "}
                  {order.pickup?.address || order.pickupLocation || "N/A"}
                </p>
                <p>
                  <strong>Drop:</strong>{" "}
                  {order.drop?.address || order.dropLocation || "N/A"}
                </p>
                <p>
                  <strong>Goods:</strong> {order.goodsType}
                </p>
                <p>
                  <strong>Weight:</strong> {order.weight} kg
                </p>

                <p><strong>Distance:</strong> {order.distanceKm ? `${order.distanceKm} km` : "N/A"}</p>
<p><strong>Fare:</strong> {order.fare ? `₹${order.fare}` : "N/A"}</p>

                <div className="order-footer">
                  <span
                    className="status-badge"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>

                  <div className="order-actions-wrapper">
                    <div className="order-actions-top">
                      {showDetails ? (
                        <button
                          className="details-btn"
                          onClick={() => navigate(`/user/order/${order._id}`)}
                        >
                          👁 View Details
                        </button>
                      ) : (
                        <div className="action-placeholder"></div>
                      )}

                      {showCancel ? (
                        <button
                          className="cancel-btn"
                          disabled={cancellingId === order._id}
                          onClick={() => handleCancel(order._id)}
                        >
                          {cancellingId === order._id
                            ? "Cancelling..."
                            : "❌ Cancel"}
                        </button>
                      ) : (
                        <div className="action-placeholder"></div>
                      )}
                    </div>

                    {!isDelivered && !isCancelled && (
                      <div className="order-actions-bottom">
                        <button
                          className="track-btn full-width-btn"
                          disabled={!trackEnabled}
                          onClick={() => navigate(`/user/track/${order._id}`)}
                        >
                          📍 Track Order
                        </button>

                        {!trackEnabled && (
                          <small className="track-hint">
                            ⏳ Tracking available after driver assignment
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;