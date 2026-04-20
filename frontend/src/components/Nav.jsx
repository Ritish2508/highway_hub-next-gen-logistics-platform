// import React from 'react'
// import "../styles/NavBar.css";

// // const Navbar = () => {
// //   return (
// //     <nav className="navbar">
// //   <h2 className="logo">Highway Hub</h2>

// //   <ul className="nav-links">
// //     <li className="demo-btn">Book a Demo</li>
// //     <li>Services</li>
// //     <li>Registration</li>
// //     <li>Login</li>
    
// //   </ul>
// // </nav>



// //   );
// // };

// // export default Navbar;


//  const NavBar = ({ openModal }) => {
//   return (
//     <nav className="navbar">
//       <h2 className="logo">Highway Hub</h2>

//       <ul className="nav-links">
//         <li>Services</li>
//         <li onClick={() => openModal("register")}>Registration</li>
//         <li onClick={() => openModal("login")}>Login</li>
//         <li onClick={() => navigate("/driver/login")}>
//           Driver Login
//         </li>
//         <li className="demo-btn">Book a Demo</li>
//       </ul>
//     </nav>
//   );
// };
// export default NavBar;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = ({ openModal }) => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  // ✅ ESC key se close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowDemo(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ✅ Background scroll lock
  useEffect(() => {
    document.body.style.overflow = showDemo ? "hidden" : "auto";
  }, [showDemo]);

  return (
    <>
      <nav className="navbar">
        <h2 className="logo">Highway Hub</h2>

        <ul className="nav-links">
          <li>Services</li>

          <li onClick={() => openModal("register")}>
            Registration
          </li>

          <li onClick={() => openModal("login")}>
            Login
          </li>

          <li onClick={() => navigate("/driver/login")}>
            Driver Login
          </li>

          {/* ✅ DEMO BUTTON */}
          <li className="demo-btn" onClick={() => setShowDemo(true)}>
            Book a Demo
          </li>
        </ul>
      </nav>

      {/* ✅ DEMO MODAL */}
      {showDemo && (
        <div
          className="demo-overlay"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="demo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <span
              className="close-btn"
              onClick={() => setShowDemo(false)}
            >
              ×
            </span>

            {/* ✅ YouTube Video */}
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/zuwjScQG-zc?autoplay=1&mute=1"
              title="Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;