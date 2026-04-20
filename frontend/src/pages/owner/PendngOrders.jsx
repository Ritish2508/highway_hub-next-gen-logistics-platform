// import { useEffect, useState } from "react";
// import api from "../../api/api";

// const PendingOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await api.get("/owner/pending-orders");
//       setOrders(data.orders);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const acceptOrder = async (id) => {
//     try {
//       await api.put(`/owner/accept/${id}`);
//       alert("Order accepted!");
//       fetchOrders(); // refresh list
//     } catch (error) {
//       alert("Failed to accept order");
//     }
//   };

//   if (loading) return <h3>Loading...</h3>;

//   return (
//     <div>
//       <h2>Pending Orders</h2>

//       {orders.length === 0 ? (
//         <p>No pending orders</p>
//       ) : (
//         orders.map((order) => (
//           <div key={order._id} className="order-card">
//             <p><b>Pickup:</b> {order.pickupLocation}</p>
//             <p><b>Drop:</b> {order.dropLocation}</p>
//             <p><b>Goods:</b> {order.goodsType}</p>
//             <p><b>Weight:</b> {order.weight} kg</p>

//             <button onClick={() => acceptOrder(order._id)}>
//               Accept Order
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default PendingOrders;

import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Owner.css";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/owner/pending-orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const acceptOrder = async (id) => {
    try {
      await api.put(`/owner/accept/${id}`);
      fetchOrders();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to accept order");
    }
  };

  if (loading) return <h3 className="owner-loading">Loading...</h3>;

  return (
    <div className="owner-page">
      <div className="owner-header">
        <h2>📌 Pending Orders</h2>
        <button className="owner-refresh" onClick={fetchOrders}>
          ↻ Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="owner-empty">
          <h3>No pending orders</h3>
          <p>New orders will appear here.</p>
        </div>
      ) : (
        <div className="owner-grid">
          {orders.map((order) => (
            <div key={order._id} className="owner-card">
              <div className="owner-card-top">
                <span className="owner-id">#{order._id.slice(-6)}</span>
                <span className={`owner-status ${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <p className="owner-line">
                <b>Pickup:</b>{" "}
                {order.pickup?.address || order.pickupLocation || "N/A"}
              </p>

              <p className="owner-line">
                <b>Drop:</b>{" "}
                {order.drop?.address || order.dropLocation || "N/A"}
              </p>

              <p className="owner-line">
                <b>Goods:</b> {order.goodsType}
              </p>

              <p className="owner-line">
                <b>Weight:</b> {order.weight} kg
              </p>
              <p><strong>Distance:</strong> {order.distanceKm ? `${order.distanceKm} km` : "N/A"}</p>
<p><strong>Fare:</strong> {order.fare ? `₹${order.fare}` : "N/A"}</p>

              <button
                onClick={() => acceptOrder(order._id)}
                className="owner-btn owner-btn-primary"
              >
                ✅ Accept Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;