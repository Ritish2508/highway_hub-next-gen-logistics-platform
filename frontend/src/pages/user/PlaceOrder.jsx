



// // check points


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api"; // ✅ axios instance (recommended)
// import MapLocationPicker from "../../components/MapLocationPicker";
// import "../../styles/User.css";

// const PlaceOrder = () => {
//   const navigate = useNavigate();

//   const [pickup, setPickup] = useState(null);
//   const [drop, setDrop] = useState(null);

//   const [goodsType, setGoodsType] = useState("");
//   const [weight, setWeight] = useState("");
//   const [loading, setLoading] = useState(false);

//   const validateForm = () => {
//     if (!pickup || !drop) {
//       alert("Pickup & Drop must be selected from map");
//       return false;
//     }
//     if (!goodsType.trim()) {
//       alert("Goods type required");
//       return false;
//     }
//     if (!Number(weight) || Number(weight) <= 0) {
//       alert("Weight must be valid");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       // ✅ Your route: POST /orders/place
//       await api.post("/user/place", {
//   pickup,
//   drop,
//   goodsType: goodsType.trim(),
//   weight: Number(weight),
// });

//       alert("✅ Order placed successfully!");
//       navigate("/user/orders");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         alert("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         navigate("/login");
//       } else {
//         alert(err.response?.data?.message || "Failed to place order");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="place-order-page">
//       <h2>🚚 Place New Order (Map Verified)</h2>

//       <form onSubmit={handleSubmit} className="order-form">
//         <MapLocationPicker label="Pickup Location" value={pickup} onChange={setPickup} />
//         <MapLocationPicker label="Drop Location" value={drop} onChange={setDrop} />

//         <label>Goods Type</label>
//         <input
//           type="text"
//           value={goodsType}
//           onChange={(e) => setGoodsType(e.target.value)}
//           placeholder="e.g. Electronics, Furniture"
//           required
//         />

//         <label>Weight (kg)</label>
//         <input
//           type="number"
//           value={weight}
//           onChange={(e) => setWeight(e.target.value)}
//           placeholder="Enter weight"
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Placing Order..." : "Place Order"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PlaceOrder;






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import MapLocationPicker from "../../components/MapLocationPicker";
import "../../styles/User.css";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [goodsType, setGoodsType] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const [estimate, setEstimate] = useState(null);
  const [estimating, setEstimating] = useState(false);

  const validateForm = () => {
    if (!pickup || !drop) {
      alert("Pickup & Drop must be selected from map");
      return false;
    }
    if (!goodsType.trim()) {
      alert("Goods type required");
      return false;
    }
    if (!Number(weight) || Number(weight) <= 0) {
      alert("Weight must be valid");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!pickup || !drop || !Number(weight) || Number(weight) <= 0) {
        setEstimate(null);
        return;
      }

      try {
        setEstimating(true);

        const res = await api.post("/user/estimate-fare", {
          pickup,
          drop,
          weight: Number(weight),
        });

        setEstimate({
          distanceKm: res.data.distanceKm,
          durationMin: res.data.durationMin,
          fare: res.data.fare,
        });
      } catch (error) {
        console.error("Estimate error:", error);
        setEstimate(null);
      } finally {
        setEstimating(false);
      }
    };

    const timer = setTimeout(fetchEstimate, 700); // small debounce
    return () => clearTimeout(timer);
  }, [pickup, drop, weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      await api.post("/user/place", {
        pickup,
        drop,
        goodsType: goodsType.trim(),
        weight: Number(weight),
      });

      alert("✅ Order placed successfully!");
      navigate("/user/orders");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Failed to place order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="place-order-page">
      <h2>🚚 Place New Order</h2>

      <form onSubmit={handleSubmit} className="order-form">
        <MapLocationPicker label="Pickup Location" value={pickup} onChange={setPickup} />
        <MapLocationPicker label="Drop Location" value={drop} onChange={setDrop} />

        <label>Goods Type</label>
        <input
          type="text"
          value={goodsType}
          onChange={(e) => setGoodsType(e.target.value)}
          placeholder="e.g. Electronics, Furniture"
          required
        />

        <label>Weight (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight"
          required
        />

        {(estimating || estimate) && (
          <div className="fare-box">
            <h4>Estimated Fare</h4>
            {estimating ? (
              <p>Calculating...</p>
            ) : (
              <>
                <p><strong>Distance:</strong> {estimate?.distanceKm} km</p>
                <p><strong>ETA:</strong> {estimate?.durationMin} min</p>
                <p><strong>Estimated Price:</strong> ₹{estimate?.fare}</p>
              </>
            )}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;