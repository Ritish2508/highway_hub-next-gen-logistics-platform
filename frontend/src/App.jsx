

// import { Routes, Route } from "react-router-dom";
// import "leaflet/dist/leaflet.css";

// import Home from "./pages/home/Home";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

// import UserDashboard from "./pages/user/UserDashboard";
// import PlaceOrder from "./pages/user/PlaceOrder";
// import MyOrders from "./pages/user/MyOrders";
// import TrackOrder from "./pages/user/TrackOrder";
// import UserOrderDetails from "./pages/user/UserOrderDetails";

// // owner pages
// import OwnerLayout from "./pages/owner/OwnerLayout";
// // import OwnerOrders from "./pages/owner/OwnerOrders";
// import AssignDriver from "./pages/owner/AssignDriver";
// import CreateDriver from "./pages/owner/CreateDriver";
// import PendingOrders from "./pages/owner/PendngOrders";
// import MyOrdersOwner from "./pages/owner/MyOrders";
// import OwnerDrivers from "./pages/owner/OwnerDrivers"
// import OwnerOrderDetails from "./pages/owner/OwnerOrderDetails";
// import OwnerTrackOrder from "./pages/owner/OwnerTrackOrder";



// // driver
// import DriverLogin from "./pages/driver/DriverLogin";
// import DriverDashboard from "./pages/driver/DriverDashboard";




// import Footer from "./components/Footer";

// const App = () => {
//   return (
//     <>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* ✅ User Dashboard (nested routes) */}
//         <Route path="/user" element={<UserDashboard />}>
//           <Route path="place-order" element={<PlaceOrder />} />
//           <Route path="orders" element={<MyOrders />} />
//           <Route path="/user/track/:orderId" element={<TrackOrder />} />
//           <Route path="/user/order/:orderId" element={<UserOrderDetails />} />
//         </Route>

//         {/* Future dashboards (placeholder) */}
//         {/* <Route path="/owner/orders" element={<OwnerOrders/>} />
//         <Route path="/driver/orders" element={<h2>Driver Orders</h2>} />
//         <Route path="/admin/dashboard" element={<h2>Admin Dashboard</h2>} /> */}
//         <Route path="/owner" element={<OwnerLayout />}>
//         <Route path="/owner/pending-orders" element={<PendingOrders />} />
//           <Route path="/owner/my-orders" element={<MyOrdersOwner />} />
//           {/* <Route path="assign" element={<AssignDriver />} /> */}
//           <Route path="/owner/assign-driver/:orderId" element={<AssignDriver />} />
//           <Route path="/owner/create-driver" element={<CreateDriver />} />
//           <Route path="/owner/drivers" element={<OwnerDrivers />} />
//           <Route path="/owner/order/:orderId" element={<OwnerOrderDetails />} />
//           <Route path="/owner/track/:orderId" element={<OwnerTrackOrder />} />

//         </Route>
//         <Route>
//           <Route path="/driver/login" element={<DriverLogin />} />
//           <Route path="/driver/dashboard" element={<DriverDashboard />} />
//         </Route>
//       </Routes>

//       <Footer />
//     </>
//   );
// };

// export default App;




import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import UserDashboard from "./pages/user/UserDashboard";
import PlaceOrder from "./pages/user/PlaceOrder";
import MyOrders from "./pages/user/MyOrders";
import TrackOrder from "./pages/user/TrackOrder";
import UserOrderDetails from "./pages/user/UserOrderDetails";

// owner pages
import OwnerLayout from "./pages/owner/OwnerLayout";
import AssignDriver from "./pages/owner/AssignDriver";
import CreateDriver from "./pages/owner/CreateDriver";
import PendingOrders from "./pages/owner/PendngOrders";
import MyOrdersOwner from "./pages/owner/MyOrders";
import OwnerDrivers from "./pages/owner/OwnerDrivers";
import OwnerOrderDetails from "./pages/owner/OwnerOrderDetails";
import OwnerTrackOrder from "./pages/owner/OwnerTrackOrder";

// driver
import DriverLogin from "./pages/driver/DriverLogin";
import DriverDashboard from "./pages/driver/DriverDashboard";

import Footer from "./components/Footer";

const App = () => {
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type); // "login" | "register"
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <>
      <Routes>
        {/* ✅ Home */}
        <Route path="/" element={<Home openModal={openModal} />} />

        {/* ❌ REMOVE THESE (IMPORTANT) */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* User Dashboard */}
        <Route path="/user" element={<UserDashboard />}>
          <Route path="place-order" element={<PlaceOrder />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="/user/track/:orderId" element={<TrackOrder />} />
          <Route path="/user/order/:orderId" element={<UserOrderDetails />} />
        </Route>

        {/* Owner */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route path="/owner/pending-orders" element={<PendingOrders />} />
          <Route path="/owner/my-orders" element={<MyOrdersOwner />} />
          <Route path="/owner/assign-driver/:orderId" element={<AssignDriver />} />
          <Route path="/owner/create-driver" element={<CreateDriver />} />
          <Route path="/owner/drivers" element={<OwnerDrivers />} />
          <Route path="/owner/order/:orderId" element={<OwnerOrderDetails />} />
          <Route path="/owner/track/:orderId" element={<OwnerTrackOrder />} />
        </Route>

        {/* Driver */}
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>

      {/* 🔥 GLOBAL MODAL */}
      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "login" && (
              <Login openModal={openModal} closeModal={closeModal} />
            )}

            {modalType === "register" && (
              <Register openModal={openModal} closeModal={closeModal} />
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default App;