



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import "./Register.css";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("+91");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const validatePhone = (phone) => {
//     const phoneRegex = /^\+91[6-9]\d{9}$/;
//     return phoneRegex.test(phone);
//   };

//   const handlePhoneChange = (e) => {
//     let value = e.target.value;

//     // always keep +91 at start
//     if (!value.startsWith("+91")) {
//       value = "+91";
//     }

//     // allow only digits and +
//     value = value.replace(/[^\d+]/g, "");

//     // max length = +91 + 10 digits = 13 chars
//     if (value.length > 13) return;

//     setPhone(value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validatePhone(phone)) {
//       alert("Phone number must be in +91XXXXXXXXXX format");
//       return;
//     }

//     setLoading(true);

//     try {
//       await api.post("/auth/register", {
//         name,
//         email,
//         phone,
//         password,
//         role,
//       });

//       if (role === "owner") {
//         alert("Registered successfully. Please wait for admin approval.");
//       } else {
//         alert("Registered successfully. Please login.");
//       }

//       // navigate("login");
//       navigate("/", { state: { openLogin: true } });
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-page">
//       <div className="register-card shadow-lg">
//         <h3 className="text-center mb-4 fw-bold">Create Account</h3>

//         <form onSubmit={handleSubmit}>
//           {/* Name */}
//           <div className="mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="mb-3">
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Phone */}
//           <div className="mb-3">
//             <input
//               type="tel"
//               className="form-control"
//               placeholder="+919876543210"
//               value={phone}
//               onChange={handlePhoneChange}
//               required
//             />
//             <small className="text-muted">
//               Enter phone in +91XXXXXXXXXX format
//             </small>
//           </div>

//           {/* Password */}
//           <div className="mb-3">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Password (min 6 characters)"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Role */}
//           <div className="mb-3">
//             <select
//               className="form-select"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="user">User</option>
//               <option value="owner">Owner</option>
//             </select>

//             {role === "owner" && (
//               <small className="text-danger">
//                 Owner account requires admin approval
//               </small>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-center mt-3 mb-0">
//           Already have an account?{" "}
//           <span
//             className="text-primary fw-semibold"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate("login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;





import { useState } from "react";
import api from "../../api/api";
import "./Register.css";

const Register = ({ openModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const validatePhone = (phone) => {
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith("+91")) {
      value = "+91";
    }

    value = value.replace(/[^\d+]/g, "");

    if (value.length > 13) return;

    setPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      alert("Phone number must be in +91XXXXXXXXXX format");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role,
      });

      if (role === "owner") {
        alert("Registered successfully. Please wait for admin approval.");
      } else {
        alert("Registered successfully. Please login.");
      }

      // 🔥 After register → open login modal
      openModal("login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card shadow-lg">
        <h3 className="text-center mb-4 fw-bold">Create Account</h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              placeholder="+919876543210"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            <small className="text-muted">
              Enter phone in +91XXXXXXXXXX format
            </small>
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-3">
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>

            {role === "owner" && (
              <small className="text-danger">
                Owner account requires admin approval
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* 🔥 FIXED LOGIN BUTTON */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => openModal("login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;