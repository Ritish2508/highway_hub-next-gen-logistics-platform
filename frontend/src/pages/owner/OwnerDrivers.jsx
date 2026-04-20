


// import { useEffect, useState } from "react";
// import api from "../../api/api";

// const OwnerDrivers = () => {
//   const [drivers, setDrivers] = useState([]);

//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const { data } = await api.get("/owner/drivers");
//         setDrivers(data.drivers);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchDrivers();
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">My Drivers</h2>
//       <table className="border-collapse border w-full">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2 border">Driver ID</th>
//             <th className="p-2 border">Availability</th>
//             <th className="p-2 border">Password</th>
//           </tr>
//         </thead>
//         <tbody>
//           {drivers.map((driver) => (
//             <tr key={driver._id}>
//               <td className="p-2 border">{driver.driverId}</td>
//               <td className="p-2 border">{driver.isAvailable ? "Available" : "Assigned"}</td>
//               <td className="p-2 border">{driver.plainPassword}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OwnerDrivers;



import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/Owner.css"; // 🔥 Custom CSS

const OwnerDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data } = await api.get("/owner/drivers");
        setDrivers(data.drivers || []);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch drivers");
      }
    };
    fetchDrivers();
  }, []);

  return (
    <div className="owner-drivers-container">
      <h2 className="heading">My Drivers</h2>

      {drivers.length === 0 ? (
        <p className="no-data">No drivers found.</p>
      ) : (
        <div className="table-responsive">
          <table className="drivers-table">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Availability</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.driverId}</td>
                  <td>
                    <span
                      className={
                        driver.isAvailable ? "badge available" : "badge assigned"
                      }
                    >
                      {driver.isAvailable ? "Available" : "Assigned"}
                    </span>
                  </td>
                  <td>{driver.plainPassword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerDrivers;
