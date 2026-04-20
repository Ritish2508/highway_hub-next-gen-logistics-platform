



// import { useState, useEffect } from "react";
// import NavBar from "../../components/Nav.jsx";
// import {
//   Hero,
//   Features,
//   Features2,
//   KeyFeatures,
//   Industries,
//   WhySection,
//   Banner,
//   Feedback,
//   CTA,
//   FAQ,
// } from "../../components/Hero.jsx";

// import Login from "../auth/Login.jsx";
// import Register from "../auth/Register.jsx";
// import "./Home.css";

// const Home = () => {
//   const [modalType, setModalType] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     if (modalType) {
//       const timer = setTimeout(() => setShowModal(true), 50);
//       return () => clearTimeout(timer);
//     } else {
//       setShowModal(false);
//     }
//   }, [modalType]);

//   const closeModal = () => {
//     setShowModal(false);
//     setTimeout(() => setModalType(null), 300);
//   };

//   return (
//     <>
//       <NavBar openModal={setModalType} />

//       <Hero />
//       <Features />
//       <Features2 />
//       <KeyFeatures />
//       <Industries />
//       <WhySection />
//       <Banner />
//       <Feedback />

//       {/* ✅ IMPORTANT: openModal pass kiya */}
//       <CTA openModal={setModalType} />

//       <FAQ />

//       {modalType && (
//         <div
//           className={`modal-overlay ${showModal ? "active" : ""}`}
//           onClick={closeModal}
//         >
//           <div
//             className={`modal-content ${showModal ? "scale-in" : ""}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="close-btn" onClick={closeModal}>
//               ✕
//             </button>

//             {modalType === "login" && <Login />}
//             {modalType === "register" && <Register />}
            

//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Home;



import { useState, useEffect } from "react";
import NavBar from "../../components/Nav.jsx";
import {
  Hero,
  Features,
  Features2,
  KeyFeatures,
  Industries,
  WhySection,
  Banner,
  Feedback,
  CTA,
  FAQ,
} from "../../components/Hero.jsx";

import Login from "../auth/Login.jsx";
import Register from "../auth/Register.jsx";
import "./Home.css";

const Home = () => {
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => setShowModal(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [modalType]);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalType(null), 300);
  };

  return (
    <>
      {/* ✅ Navbar */}
      <NavBar openModal={openModal} />

      <Hero />
      <Features />
      <Features2 />
      <KeyFeatures />
      <Industries />
      <WhySection />
      <Banner />
      <Feedback />

      {/* ✅ CTA */}
      <CTA openModal={openModal} />

      <FAQ />

      {/* 🔥 MODAL */}
      {modalType && (
        <div
          className={`modal-overlay ${showModal ? "active" : ""}`}
          onClick={closeModal}
        >
          <div
            className={`modal-content ${showModal ? "scale-in" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ Close Button */}
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>

            {/* ✅ LOGIN */}
            {modalType === "login" && (
              <Login openModal={openModal} />
            )}

            {/* ✅ REGISTER */}
            {modalType === "register" && (
              <Register openModal={openModal} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;