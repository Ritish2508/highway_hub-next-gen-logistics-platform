// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = await login(email, password);
//       console.log("LOGIN RESPONSE 👉", data);

//       if (data?.token) {
//         // role-based redirect
//        if (data.role === "admin") navigate("/admin/dashboard");
// // else if (data.role === "owner") navigate("/owner/orders");  
// //    ///owner/my-orders
// else if (data.role === "owner") navigate("/owner/my-orders");
// else if (data.role === "driver") navigate("/driver/orders");
// else navigate("/user/orders"); 
//       }
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      if (data?.token) {
        if (data.role === "admin") navigate("/admin/dashboard");
        else if (data.role === "owner") navigate("/owner/my-orders");
        else if (data.role === "driver") navigate("/driver/orders");
        else navigate("/user/orders");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Login</h2>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;