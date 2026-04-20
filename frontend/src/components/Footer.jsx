// import "./Footer.css";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <h2 className="logo">HighWay Hub</h2>
          <p>
            HighWay Hub Mitra is the leading Transport Management Software.
            Which helps transport and logistics company to manage their
            daily operations digitally.
          </p>

          <div className="socials">
            <span>📷</span>
            <span>▶</span>
            <span>in</span>
            <span>f</span>
            <span>X</span>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <h3>Useful Links</h3>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Contact us</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-contact">
          <p>📍 306, Third Floor, Tower A1, Malviya Nagar , Gorakhpur, Uttar Pradesh – 273010</p>
          <p>✉ info@highwayHubLogistics.com</p>
          <p>📞 +91-9219238117</p>
        </div>

      </div>

      <div className="footer-bottom">
        Copyright © 2026 HighWay Hub, All Rights Reserved
      </div>

    </footer>
  );
};

export default Footer;
