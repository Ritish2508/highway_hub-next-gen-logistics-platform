


// import { useState } from "react";
// import api from "../../api/api";

// const CreateDriver = () => {
//   const [driverId, setDriverId] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { data } = await api.post("/driver/create", {
//         driverId,
//         password,
//       });

//       alert("Driver created successfully!");
//       setDriverId("");
//       setPassword("");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to create driver");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Create Driver</h2>

//       <form onSubmit={handleCreate}>
//         <input
//           type="text"
//           placeholder="Driver ID"
//           value={driverId}
//           onChange={(e) => setDriverId(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating..." : "Create Driver"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateDriver;


import { useState } from "react";
import api from "../../api/api";
import "../../styles/Owner.css"; // 🔥 custom CSS

const CreateDriver = () => {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/driver/create", { driverId, password });
      alert("Driver created successfully!");
      setDriverId("");
      setPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-driver-container d-flex justify-content-center align-items-center">
      <div className="driver-card p-5 shadow-sm rounded-4">
        <h2 className="text-center mb-4">Create Driver</h2>
        <form onSubmit={handleCreate} className="driver-form">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Driver ID"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
              className="form-control custom-input"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control custom-input"
            />
          </div>
          <button
            type="submit"
            className="btn btn-orange w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDriver;
