// import { useEffect, useState } from "react";
import "./Home.css";

import { useEffect, useState } from "react";

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HERO WRAPPER */}
      <div className="hero-wrapper">
        <div
          className="hero"
          style={{
            transform: `
              scale(${1 + scrollY * 0.0004})
              translateY(-${scrollY * 0.25}px)
            `,
          }}
        >
          <div className="overlay">
            <h1>Highway Hub</h1>
            <p>Smart Logistics, Faster Delivery</p>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="content">
        <section className="about-tms">
          <div className="about-left">
            <h2>About HighWay Hub  Software (HighWay Hub Mitra)</h2>

            <p>
              At <strong>HighWay Hub Mitra</strong>, we offer a powerful{" "}
              <strong>Transport Management Software (HighWay Hub Mitra)</strong> that
              simplifies and optimizes your entire transport and logistics
              workflow. From shipment planning and fleet management to route
              optimization and delivery tracking, our cloud-based platform
              centralizes operations, minimizes manual effort, and ensures
              smooth, accurate transport management.
            </p>

            <p className="ideal">HighWay Hub is ideal for:</p>

            <ul>
              <li>Transport companies</li>
              <li>Logistics service providers</li>
              <li>Courier & parcel businesses</li>
              <li>Fleet operators</li>
              <li>Supply chain and distribution companies</li>
            </ul>
          </div>

          <div className="about-right">
            <img src={tmsImg} alt="TMS Dashboard" />
          </div>
        </section>
      </div>
    </>
  );
};


//

// import "./AboutTMS.css";

import tmsImg from "../assets/tmsImg.png";
import { FaCloud, FaTruckMoving, FaMapMarkedAlt, FaChartLine } from "react-icons/fa";

const features = [
  {
    title: "Cloud-Based & Web-Enabled Platform",
    desc: "Access your transportation operations anytime, anywhere through a secure, web-based TMS—no installations required.",
    icon: <FaCloud />,
    color: "blue",
  },
  {
    title: "Centralized Transportation Control",
    desc: "Manage shipments, vehicles, drivers, routes, and deliveries from a single dashboard with complete visibility.",
    icon: <FaMapMarkedAlt />,
    color: "orange",
  },
  {
    title: "Real-Time Shipment & Vehicle Tracking",
    desc: "Track vehicles and shipments in real time to ensure on-time deliveries and proactive issue resolution.",
    icon: <FaTruckMoving />,
    color: "orange",
  },
  {
    title: "Scalable for Transport Businesses",
    desc: "Whether you manage a small fleet or large transportation network, TMS Mitra scales with your business.",
    icon: <FaChartLine />,
    color: "blue",
  },
];

export const Features = () => {
  return (
    <section>
    
       <h2 style={{textAlign:"center" , fontWeight:"bold"}}>Why Choose HighWay Hub Mitra Transport Management Software?</h2>
     <p style={{textAlign:"center"}}>HighWay Hub Mitra is built to simplify complex transportation workflows and improve operational efficiency.</p>
     
     <div className="features-wrapper">
    <div className="features-container">

      {features.map((item, index) => (
        <div key={index} className={`feature-card ${item.color}`}>
          <div className="icon-circle">{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
    </div>
    </section>
  );
};

// feature page 2

const features2 = [
  {
    title: "Electronic POD",
    desc: "Proof of delivery (POD) process creates documentation to verify that the goods have been received by the customer & helps to ensure there is an agreement with the customer.",
    img: "/img1.png",
  },
  {
    title: "Route Analysis",
    desc: "Route analysis enables you to design your own routes from scratch, or utilize routing algorithms to find efficient travel paths between locations.",
    img: "/img2.png",
  },
  {
    title: "Fleet Management",
    desc: "Effective logistics fleet management optimizes your management, maintenance and tracking. Automated service reminders and reports ensure timely deliveries.",
    img: "/img3.png",
  },
  {
    title: "DEPS and Claims",
    desc: "DEPS are key logistics issues that can lead to claims against suppliers or carriers. Damage and shortage claims help recover losses.",
    img: "/img4.png",
  },
  {
    title: "Order Entry",
    desc: "Order entry with automatic order recognition. Order entry can be set up to include all necessary details automatically.",
    img: "/img5.png",
  },
  {
    title: "Real-time Tracking",
    desc: "TMS allows users to track real-time location and status of vehicles from their desktop and mobile devices.",
    img: "/img6.png",
  },
];
export const Features2 = () => {
  return (
    <section className="features-section2">
      <h2 className="features-heading2">
        Streamline Your Logistics and Uplift Performance with <br />
        <span>HighWay Hub  Software</span>
      </h2>

      <div className="features-grid2">
        {features2.map((item, index) => (
          <div className="feature-card2" key={index}>
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};


// alternate key feature



const keyFeatures = [
  {
    title: "CN Entry & Consignment Management",
    points: [
      "E-Waybill based Consignment Booking",
      "Barcode labels as per LR copy and packages",
      "Estimated time of Delivery",
      "Estimated cost visibility",
    ],
    img: "/feature1.png",
    reverse: false,
  },
  {
    title: "Truck Hire & Dispatch Management",
    points: [
      "Route-based Dispatch",
      "Vehicle-based Cost Calculation",
      "Departure and Arrival scans with Record of DEPS",
    ],
    img: "/feature2.png",
    reverse: true,
  },
  {
    title: "Customer Contract Management",
    points: [
      "Vehicle, Weight and Location based Contract",
      "ODA / OPA Charges Applicability",
      "Contract Head and Rate Copy Option",
    ],
    img: "/feature3.png",
    reverse: false,
  },
  {
    title: "Customer Billing",
    points: [
      "Bill Scheduler",
      "Alert for Unbilled Amount",
      "Bill Submission and Tracking",
    ],
    img: "/feature4.png",
    reverse: true,
  },
];

export const KeyFeatures = () => {
  return (
    <section className="keyfeatures-section">
      <h2 className="keyfeatures-heading">
        Key Features of Our <br />
        <span>HighWay Hub  Software</span>
      </h2>

      {keyFeatures.map((item, index) => (
        <div
          className={`keyfeatures-row ${
            item.reverse ? "reverse" : ""
          }`}
          key={index}
        >
          <div className="keyfeatures-text">
            <h3>{item.title}</h3>
            <ul>
              {item.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <button>CONTACT US</button>
          </div>

          <div className="keyfeatures-image">
            <img src={item.img} alt={item.title} />
          </div>
        </div>
      ))}
    </section>
  );
};


// industries


import { FaTruck, FaWarehouse, FaMapMarkerAlt, FaIndustry } from "react-icons/fa";

export const Industries = () => {
  return (
    <section className="industries-section">
     <div className="blue-overlay"></div>

      <div className="industries-content">
        <p className="subtitle">Industries We Serve</p>
        <h2 className="title">Who Should Use HighWay Hub Mitra?</h2>

        <div className="industries-grid">
          <div className="industry-card">
            <div className="icon">
              <FaTruck />
            </div>
            <p>Transport & fleet operators</p>
          </div>

          <div className="industry-card">
            <div className="icon">
              <FaWarehouse />
            </div>
            <p>Logistics and freight companies</p>
          </div>

          <div className="industry-card">
            <div className="icon">
              <FaMapMarkerAlt />
            </div>
            <p>Courier and last-mile delivery services</p>
          </div>

          <div className="industry-card">
            <div className="icon">
              <FaIndustry />
            </div>
            <p>Manufacturing and distribution businesses</p>
          </div>
        </div>
      </div>
    </section>
  );
};



// important 



const features3 = [
  {
    icon: "🚀",
    title: "Streamlines Workflows",
    desc: "Automates transportation work from booking to delivery, making daily operations smooth and faster.",
  },
  {
    icon: "📄",
    title: "Reduces Errors & Paperwork",
    desc: "Cuts down manual work and paperwork, reducing mistakes and saving time.",
  },
  {
    icon: "💰",
    title: "Improves Cost Visibility",
    desc: "Shows clear and accurate shipment costs, helping with better billing and expense control.",
  },
  {
    icon: "⭐",
    title: "Enhances Customer Satisfaction",
    desc: "Provides real-time delivery updates so customers stay informed and satisfied.",
  },
  {
    icon: "📍",
    title: "Optimizes Fleet & Routes",
    desc: "Improves vehicle usage and route planning for quicker deliveries and lower costs.",
  },
  {
    icon: "📊",
    title: "Data-Driven Decision Making",
    desc: "Provides analytics and performance insights that help businesses make smarter decisions.",
  },
];

export const WhySection = () => {
  return (
    <section className="tms-section">
      <h1 className="tms-title">
        Why is HighWay Hub  Software (HighWay Hub Mitra) important?
      </h1>

      <div className="tms-grid">
        {features3.map((item, index) => (
          <div className="tms-card" key={index}>
            <div className="icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


// banner


export const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-content">
        <h1>
          Secure, Cloud-Based & Reliable HighWay Hub Mitra Software
        </h1>

        <p>
          HighWay Hub Mitra is a secure cloud-based transport management system designed
          to ensure data safety, high software availability, and performance
          reliability. Manage your transportation operations confidently from
          anywhere. HighWay Hub Mitra is a reliable <b>TMS Software Provider in India.</b>
        </p>
      </div>
    </section>
  );
};


// feedback



const testimonials = [
  {
    name: "Om Prakash",
    text: "Great place for solutions of IT software. They have vast services and solutions. I recommend 👌",
  },
  {
    name: "Aryan Raj",
    text: "The software is extremely intuitive and easy to use. It has got a host of interactive and useful features customized to suit our requirements.",
  },
];

export const Feedback = () => {
  return (
    <section className="feedback">
      <p className="feedback-sub">Feedback</p>
      <h2 className="feedback-title">What People Think About Us</h2>

      <div className="feedback-grid">
        {testimonials.map((item, index) => (
          <div className="feedback-card" key={index}>
            <div className="user">
              <div className="avatar">👤</div>
              <div>
                <h3>{item.name}</h3>
                <p className="review">{item.text}</p>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="review-btn">
        Review us on <span>G</span>
      </button>
    </section>
  );
};

// CTA


import { useNavigate } from "react-router-dom";
export const CTA = ({ openModal }) => {

  const handleClick = () => {
    openModal("register"); // ✅ modal open karega
  };

  return (
    <section className="cta">
      <div className="cta-content">
        <h1>Get Started with HighWay Hub Mitra Today</h1>

        <p>
          Transform your transportation operations with <b>HighWay Hub Mitra Transport
          Management Software.</b> Optimize routes, track fleets,
          reduce costs, and deliver smarter.
        </p>

        <button className="cta-btn" onClick={handleClick}>
          Get Started Today
        </button>
      </div>
    </section>
  );
};




// FAQ



const faqData = [
  {
    question: "What is HighWay Hub Mitra Software?",
    answer:
      "HighWay Hub Mitra Software is a digital system that helps businesses manage transport operations such as vehicle planning, shipment tracking, freight billing, driver management, and delivery performance. TMS Mitra simplifies end-to-end transport operations for Indian logistics and fleet businesses.",
  },
  {
    question:
      "How is TMS Mitra different from other transport software providers?",
    answer:
      "HighWay Hub Mitra provides easy-to-use tools, real-time tracking, smart reporting, and cost-efficient management tailored for Indian logistics companies.",
  },
  {
    question: "Who should use HighWay Hub Mitra Transport Management Software?",
    answer:
      "Logistics companies, fleet owners, delivery services, and businesses managing transportation operations can benefit from HighWay Hub  Mitra.",
  },
  {
    question: "Is HighWay Hub Mitra a cloud-based TMS software?",
    answer:
      "Yes, HighWay Hub Mitra is cloud-based, allowing secure access from anywhere with real-time updates.",
  },
  {
    question:
      "What features does HighWay Hub Mitra Transport Management System offer?",
    answer:
      "It offers vehicle tracking, billing, analytics, order management, driver management, and reporting tools.",
  },
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <h1>Frequently Asked Questions (FAQs)</h1>

      {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
          <div
            className="faq-question"
            onClick={() => toggleFAQ(index)}
          >
            <h3>{item.question}</h3>
            <span>{activeIndex === index ? "−" : "+"}</span>
          </div>

          {activeIndex === index && (
            <p className="faq-answer">{item.answer}</p>
          )}
        </div>
      ))}
    </section>
  );
};


