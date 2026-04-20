import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import "../../styles/Owner.css";
import OrderStatusTimeline from "../../components/OrderStatusTimeline";

export default function OwnerOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const { data } = await api.get(`/owner/order/${orderId}`);
      setOrder(data.order);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load order details");
      navigate("/owner/my-orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [orderId]);

  if (loading) return <h3 className="owner-loading">Loading...</h3>;
  if (!order) return null;

  const pickupAddr = order.pickup?.address || order.pickupLocation || "N/A";
  const dropAddr = order.drop?.address || order.dropLocation || "N/A";

  return (
    <div className="owner-page">
      <div className="owner-header">
        <h2>📄 Order Details</h2>
        <button className="owner-refresh" onClick={() => navigate("/owner/my-orders")}>
          ← Back
        </button>
      </div>

      <div className="owner-detail-card">
        <div className="owner-detail-top">
          <div>
            <div className="detail-label">Order ID</div>
            <div className="detail-value mono" title={order._id}>
              {order._id}
            </div>
          </div>

          <div className={`owner-status ${order.status?.toLowerCase()}`}>
            {order.status}
          </div>
        </div>

        <div className="owner-detail-grid">
          {/* USER */}
          <div className="detail-box">
            <h3 className="detail-title">👤 User</h3>
            <p><b>Name:</b> {order.user?.name || "N/A"}</p>
            <p><b>Email:</b> {order.user?.email || "N/A"}</p>
            <p><b>Phone:</b> {order.user?.phone || "N/A"}</p>
          </div>

          {/* LOCATIONS */}
          <div className="detail-box">
            <h3 className="detail-title">📍 Locations</h3>
            <p><b>Pickup:</b> {pickupAddr}</p>
            {order.pickup?.lat != null && (
              <p className="muted">
                ({order.pickup.lat.toFixed(5)}, {order.pickup.lng.toFixed(5)})
              </p>
            )}

            <p style={{ marginTop: 10 }}><b>Drop:</b> {dropAddr}</p>
            {order.drop?.lat != null && (
              <p className="muted">
                ({order.drop.lat.toFixed(5)}, {order.drop.lng.toFixed(5)})
              </p>
            )}
          </div>

          {/* GOODS */}
          <div className="detail-box">
            <h3 className="detail-title">📦 Goods</h3>
            <p><b>Type:</b> {order.goodsType}</p>
            <p><b>Weight:</b> {order.weight} kg</p>
            <p><b>Distance:</b> {order.distanceKm ? `${order.distanceKm} km` : "N/A"}</p>
  <p><b>ETA:</b> {order.estimatedDurationMin ? `${order.estimatedDurationMin} min` : "N/A"}</p>
  <p><b>Fare:</b> {order.fare ? `₹${order.fare}` : "N/A"}</p>
          </div>

          {/* DRIVER */}
          <div className="detail-box">
            <h3 className="detail-title">🚚 Driver</h3>
            <p><b>Driver ID:</b> {order.driver?.driverId || "Not assigned"}</p>
          </div>

          {/* META */}
          <div className="detail-box">
            <h3 className="detail-title">🕒 Meta</h3>
            <p><b>Created:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
            <p><b>Updated:</b> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}</p>
          </div>
        </div>
      </div>
      <OrderStatusTimeline status={order.status} />
    </div>
  );
}