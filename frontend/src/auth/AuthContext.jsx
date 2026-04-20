

// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: null,
//     role: null,
//     user: null,
//   });

//   // restore auth on refresh
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (token && role) {
//       setAuth({
//         token,
//         role,
//         user: null,
//       });
//     }
//   }, []);

//   const login = async (email, password) => {
//     const { data } = await api.post("/auth/login", { email, password });

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("role", data.role);

//     setAuth({
//       token: data.token,
//       role: data.role,
//       user: null,
//     });

//     return data;
//   };

//   const logout = () => {
//     localStorage.clear();
//     setAuth({
//       token: null,
//       role: null,
//       user: null,
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    user: null,
  });

  // restore auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setAuth({
        token,
        role,
        user: null,
      });
    }
  }, []);

  // 🔥 AUTO ATTACH TOKEN TO AXIOS
  useEffect(() => {
    if (auth.token) {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    setAuth({
      token: data.token,
      role: data.role,
      user: null,
    });

    return data;
  };

  const logout = () => {
    localStorage.clear();
    setAuth({
      token: null,
      role: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
