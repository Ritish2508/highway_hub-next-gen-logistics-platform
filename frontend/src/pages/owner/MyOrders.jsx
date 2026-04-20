



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import "../../styles/Owner.css";

// const MyOrdersOwner = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMyOrders = async () => {
//       try {
//         const { data } = await api.get("/owner/my-orders");
//         setOrders(data.orders || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchMyOrders();
//   }, []);

//   const handleAssignDriver = (orderId) =>
//     navigate(`/owner/assign-driver/${orderId}`);

//   const handleViewDetails = (orderId) =>
//     navigate(`/owner/order/${orderId}`);

//   // ✅ helper: normalize status
//   const canAssignDriver = (status) => {
//     const s = (status || "").toLowerCase().replace(/\s+/g, "");
//     return s === "accepted";
//   };

//   return (
//     <div className="my-orders-container p-3">
//       <h2 className="text-center mb-4">My Accepted Orders</h2>

//       {orders.length === 0 ? (
//         <p className="text-center">No accepted orders found.</p>
//       ) : (
//         <div className="orders-grid">
//           {orders.map((order) => (
//             <div key={order._id} className="order-card shadow-sm">
//               <h5>Order ID: {order._id}</h5>

//               <p>
//                 <b>Status:</b>{" "}
//                 <span className={`owner-status ${order.status?.toLowerCase()}`}>
//                   {order.status}
//                 </span>
//               </p>

//               <p><b>User:</b> {order.user?.name || "N/A"}</p>

//               <div className="order-buttons mt-3">
//                 {/* ✅ Assign Driver ONLY if status === Accepted */}
//                 {canAssignDriver(order.status) && (
//                   <button
//                     onClick={() => handleAssignDriver(order._id)}
//                     className="btn btn-orange"
//                   >
//                     Assign Driver
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleViewDetails(order._id)}
//                   className="btn btn-blue"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrdersOwner;





import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/Owner.css";

const MyOrdersOwner = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get("/owner/my-orders");
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchMyOrders();
  }, []);

  const handleAssignDriver = (orderId) =>
    navigate(`/owner/assign-driver/${orderId}`);

  const handleViewDetails = (orderId) =>
    navigate(`/owner/order/${orderId}`);

  const handleTrackOrder = (orderId) =>
    navigate(`/owner/track/${orderId}`);

  // ✅ normalize status
  const normalizeStatus = (status) =>
    (status || "").toLowerCase().replace(/\s+/g, "");

  // ✅ Assign Driver only when status = Accepted
  const canAssignDriver = (status) => {
    return normalizeStatus(status) === "accepted";
  };

  // ✅ Track only when driver is assigned / moving
  const canTrackOrder = (status) => {
    const s = normalizeStatus(status);
    return ["assigned", "pickedup", "intransit"].includes(s);
  };

  return (
    <div className="my-orders-container p-3">
      <h2 className="text-center mb-4">My Accepted Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">No accepted orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card shadow-sm">
              <h5 className="owner-order-id" title={order._id}>
                Order ID: #{order._id.slice(-6)}
              </h5>

              <p>
                <b>Status:</b>{" "}
                <span className={`owner-status ${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>

              <p><b>User:</b> {order.user?.name || "N/A"}</p>

              <div className="owner-actions-wrapper">
                {/* top row */}
                <div className="owner-actions-top">
                  {canAssignDriver(order.status) ? (
                    <button
                      onClick={() => handleAssignDriver(order._id)}
                      className="btn btn-orange"
                    >
                      Assign Driver
                    </button>
                  ) : (
                    <div className="owner-action-placeholder"></div>
                  )}

                  <button
                    onClick={() => handleViewDetails(order._id)}
                    className="btn btn-blue"
                  >
                    View Details
                  </button>
                </div>

                {/* bottom row */}
                {canTrackOrder(order.status) && (
                  <div className="owner-actions-bottom">
                    <button
                      onClick={() => handleTrackOrder(order._id)}
                      className="btn btn-dark-track"
                    >
                      📍 Track Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersOwner;