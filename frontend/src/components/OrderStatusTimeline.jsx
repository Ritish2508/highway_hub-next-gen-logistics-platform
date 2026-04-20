import "../styles/OrderTimeline.css";

const steps = [
  "Pending",
  "Accepted",
  "Assigned",
  "PickedUp",
  "InTransit",
  "Delivered",
];

const getStepState = (currentStatus, step) => {
  const normalized = (currentStatus || "").toLowerCase();

  if (normalized === "cancelled") {
    return "cancelled";
  }

  const currentIndex = steps.findIndex(
    (s) => s.toLowerCase() === normalized
  );
  const stepIndex = steps.findIndex(
    (s) => s.toLowerCase() === step.toLowerCase()
  );

  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "upcoming";
};

const OrderStatusTimeline = ({ status }) => {
  const isCancelled = (status || "").toLowerCase() === "cancelled";

  if (isCancelled) {
    return (
      <div className="timeline-wrapper">
        <h3 className="timeline-title">Order Timeline</h3>
        <div className="cancelled-box">❌ Order Cancelled</div>
      </div>
    );
  }

  return (
    <div className="timeline-wrapper">
      <h3 className="timeline-title">Order Timeline</h3>

      <div className="timeline">
        {steps.map((step, index) => {
          const state = getStepState(status, step);

          return (
            <div key={step} className="timeline-step">
              <div className={`timeline-circle ${state}`}>
                {state === "done" ? "✓" : index + 1}
              </div>

              <div className={`timeline-label ${state}`}>{step}</div>

              {index !== steps.length - 1 && (
                <div className={`timeline-line ${state === "done" ? "done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;