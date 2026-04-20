import { Outlet, Link } from "react-router-dom";
import "../../styles/User.css"

const UserDashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>User Panel</h3>
        <Link to="place-order">Place Order</Link>
        <Link to="orders">My Orders</Link>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
