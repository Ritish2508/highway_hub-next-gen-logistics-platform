// const AssignDriver = () => {
//   return <h2>Assign Driver Page</h2>;
// };

// export default AssignDriver;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../api/api";

// const AssignDriver = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [drivers, setDrivers] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState("");

//   // ✅ Fetch available drivers
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const { data } = await api.get("/owner/drivers"); // backend route for drivers
//         setDrivers(data.drivers);
//       } catch (error) {
//         console.error("Error fetching drivers:", error);
//       }
//     };

//     fetchDrivers();
//   }, []);

//   // ✅ Assign driver
//   const handleAssign = async () => {
//     if (!selectedDriver) {
//       alert("Please select a driver");
//       return;
//     }

//     try {
//       await api.post(`/owner/assign-driver/${orderId}`, {
//         driverId: selectedDriver,
//       });

//       alert("Driver assigned successfully!");
//       navigate("/owner/my-orders");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to assign driver");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Assign Driver to Order</h2>

//       <p>
//         <b>Order ID:</b> {orderId}
//       </p>

//       {/* Driver dropdown */}
//       <select
//         value={selectedDriver}
//         onChange={(e) => setSelectedDriver(e.target.value)}
//         style={{ padding: "10px", marginTop: "10px" }}
//       >
//         <option value="">Select Driver</option>
//         {drivers.map((driver) => (
//           <option key={driver._id} value={driver.driverId}>
//             {driver.name} ({driver.driverId})
//           </option>
//         ))}
//       </select>

//       <br />

//       <button
//         onClick={handleAssign}
//         style={{
//           marginTop: "15px",
//           background: "green",
//           color: "white",
//           padding: "10px 15px",
//           border: "none",
//           cursor: "pointer",
//           borderRadius: "5px",
//         }}
//       >
//         Assign Driver
//       </button>
//     </div>
//   );
// };

// export default AssignDriver;



import { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";

const AssignDriver = () => {
  const { orderId } = useParams(); // order ID URL se
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch owner ke drivers
  const fetchDrivers = async () => {
    try {
      const { data } = await api.get("/owner/drivers");
      setDrivers(data.drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert("Failed to load drivers");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Assign driver to order
  const handleAssign = async () => {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put(`/owner/assign-driver/${orderId}`, {
        driverId: selectedDriver,
      });

      alert(data.message);
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert(error.response?.data?.message || "Failed to assign driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Assign Driver</h2>

      <div className="form-group" style={{ marginBottom: "20px" }}>
        <label>Select Driver:</label>
        <select
          className="form-select"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="">-- Select Driver --</option>
          {drivers.map((driver) => (
            <option key={driver._id} value={driver.driverId}>
              {driver.driverId} {driver.isAvailable ? "(Available)" : "(Busy)"}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleAssign}
        disabled={loading}
      >
        {loading ? "Assigning..." : "Assign Driver"}
      </button>
    </div>
  );
};

export default AssignDriver;
