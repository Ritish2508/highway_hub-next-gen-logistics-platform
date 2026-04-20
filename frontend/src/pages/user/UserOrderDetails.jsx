import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import OrderStatusTimeline from "../../components/OrderStatusTimeline";
import "../../styles/User.css";

const UserOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/user/order/${orderId}`);
      setOrder(res.data.order);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to load order details");
      navigate("/user/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

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

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading order details...</h2>;
  }

  if (!order) return null;

  return (
    <div className="user-details-page">
      <div className="user-details-header">
        <button
          className="details-back-btn"
          onClick={() => navigate("/user/orders")}
        >
          ← Back
        </button>

        <h2>📦 Order Details</h2>
      </div>

      <div className="user-details-card">
        <div className="user-details-top">
          <div>
            <p className="detail-label">Order ID</p>
            <h3 className="detail-order-id" title={order._id}>
              {order._id}
            </h3>
          </div>

          <span
            className="status-badge large-badge"
            style={{ background: getStatusColor(order.status) }}
          >
            {order.status}
          </span>
        </div>

        <OrderStatusTimeline status={order.status} />

        <div className="user-details-grid">
          <div className="detail-box">
            <h4>📍 Locations</h4>
            <p>
              <strong>Pickup:</strong>{" "}
              {order.pickup?.address || order.pickupLocation || "N/A"}
            </p>
            <p>
              <strong>Drop:</strong>{" "}
              {order.drop?.address || order.dropLocation || "N/A"}
            </p>
          </div>

          <div className="detail-box">
            <h4>📦 Goods Info</h4>
            <p><strong>Goods Type:</strong> {order.goodsType}</p>
            <p><strong>Weight:</strong> {order.weight} kg</p>
            <p><strong>Distance:</strong> {order.distanceKm ? `${order.distanceKm} km` : "N/A"}</p>
            <p><b>ETA:</b> {order.estimatedDurationMin ? `${order.estimatedDurationMin} min` : "N/A"}</p>
            <p><strong>Fare:</strong> {order.fare ? `₹${order.fare}` : "N/A"}</p>
          </div>

          <div className="detail-box">
            <h4>🚚 Driver Info</h4>
            <p>
              <strong>Driver ID:</strong>{" "}
              {order.driver?.driverId || "Not Assigned Yet"}
            </p>
          </div>

          <div className="detail-box">
            <h4>🏢 Owner Info</h4>
            <p><strong>Name:</strong> {order.owner?.name || "Not Assigned Yet"}</p>
            <p><strong>Email:</strong> {order.owner?.email || "N/A"}</p>
            <p><strong>Phone:</strong> {order.owner?.phone || "N/A"}</p>
            
          </div>

          <div className="detail-box full-width">
            <h4>🕒 Dates</h4>
            <p>
              <strong>Created At:</strong>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {order.updatedAt
                ? new Date(order.updatedAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;