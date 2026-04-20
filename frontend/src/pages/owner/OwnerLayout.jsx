

// import { Link, Outlet } from "react-router-dom";

// const OwnerLayout = () => {
//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <div
//         style={{
//           width: "220px",
//           background: "#0b3d91",
//           color: "white",
//           padding: "20px",
//         }}
//       >
//         <h3>Owner Panel</h3>

//         <ul style={{ listStyle: "none", padding: 0 }}>
//           <li>
//             <Link to="/owner/pending-orders" style={{ color: "white" }}>
//               Pending Orders
//             </Link>
//           </li>
//           <li>
//            <Link to="/owner/my-orders">My Orders</Link>
//           </li>
//           <li>
//             <Link to="/owner/create-driver" style={{ color: "white" }}>
//               Create Driver
//             </Link>
//           </li>

//           <li>
//             <Link to="/owner/drivers" style={{ color: "white" }}>
//               My Drivers
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {/* Main content */}
//       <div style={{ flex: 1, padding: "20px" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default OwnerLayout;



import { Link, Outlet, useLocation } from "react-router-dom";
import "../../styles/Owner.css"; // custom CSS file

const OwnerLayout = () => {
  const location = useLocation(); // 🔥 for active link highlight

  const links = [
    { to: "/owner/pending-orders", label: "Pending Orders" },
    { to: "/owner/my-orders", label: "My Orders" },
    { to: "/owner/create-driver", label: "Create Driver" },
    { to: "/owner/drivers", label: "My Drivers" },
  ];

  return (
    <div className="owner-layout d-flex">
      {/* Sidebar */}
      <div className="sidebar d-flex flex-column">
        <h3 className="sidebar-title">Owner Panel</h3>
        <ul className="sidebar-links list-unstyled">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`sidebar-link ${
                  location.pathname === link.to ? "active-link" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerLayout;
