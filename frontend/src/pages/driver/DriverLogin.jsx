
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import "../../styles/Driver.css";

// function DriverLogin() {
//   const [driverId, setDriverId] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/driver/login", {
//         driverId: driverId.trim(),
//         password: password.trim(),
//       });

//       localStorage.setItem("token", res.data.token);
//       navigate("/driver/dashboard");
//     } catch (error) {
//       const msg =
//         error.response?.data?.message || "Login failed. Check credentials!";
//       alert(msg);
//     }
//   };

//   return (
//     <div className="driver-page-container">

//       {/* Modal always visible */}
//       <div className="driver-modal-overlay">
//         <div className="driver-modal-box">

//           <button
//             onClick={() => navigate("/")}
//             className="driver-close-btn"
//           >
//             ✕
//           </button>

//           <h2 className="driver-modal-title">
//             Driver Login
//           </h2>

//           <form onSubmit={handleLogin}>
//             <input
//               type="text"
//               placeholder="Driver ID"
//               value={driverId}
//               onChange={(e) => setDriverId(e.target.value)}
//               className="driver-input"
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="driver-input"
//             />

//             <button className="driver-login-btn">
//               Login
//             </button>
//           </form>

//         </div>
//       </div>

//     </div>
//   );
// }

// export default DriverLogin;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/Driver.css";

function DriverLogin() {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!driverId.trim() || !password.trim()) {
      alert("Driver ID and Password required!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/driver/login", {
        driverId: driverId.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", res.data.token);
      navigate("/driver/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Check credentials!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-login-page">
      <div className="driver-login-card shadow-lg">
        <button
          type="button"
          className="btn-close driver-close"
          aria-label="Close"
          onClick={() => navigate("/")}
        />

        <div className="text-center mb-3">
          <div className="driver-badge mb-2">🚛 Highway Hub</div>
          <h2 className="driver-title">Driver Login</h2>
          <p className="driver-subtitle mb-0">
            Sign in to view your assigned deliveries
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Driver ID</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. DRV123456"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-100 driver-login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center mt-3">
            <small className="text-muted">
              Having trouble? Contact your owner/admin.
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverLogin;