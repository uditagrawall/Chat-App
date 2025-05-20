import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children })=> {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [ socket, setSocket] = useState(null);


    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/auth/check");
        if(data.success){
          setAuthUser(data.user);
          connectSocket(data.user);
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    // Login function to handle user authentication and socket connections

    const login = async (state, credentials) => {
      try {
        const { data } = await axios.post(`/api/auth/${state}`, credentials);
        if(data.success){
          setAuthUser(data.userData);
          connectSocket(data.userData);
          axios.defaults.headers.common["token"] = data.token;
          setToken(data.token);
          localStorage.setItem("token", data.token)
          toast.success(data.message)
        } else{
              toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    // Logout function to handle user logout and socket disconnection

    const logout = async () => {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      axios.defaults.headers.common["token"] = null;
      toast.success("Logged out successfully");
      if(socket) {
        socket.disconnect();
        setSocket(null);
    }
  };

    // update profile function to handle user profile updates

    const updateProfile = async (body) => {
      try {
        const { data } = await axios.put("/api/auth/update-profile", body);
        if(data.success){
          setAuthUser(data.user);
          toast.success("Profile updated successfully");
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    // Connect socket function to handle socket connection and online users updates

    const connectSocket = (userData)=> {
      if(!userData || socket?.connected) return;
      const newSocket = io(backendUrl, {
        query: {
          userId: userData._id,
        }
      });
      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds)=> {
        setOnlineUsers(userIds);
      })
    }

    useEffect(()=> {
      if(token){
        axios.defaults.headers.common["token"] = token;
      }
      checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
      <AuthContext.Provider value={value}>
            {children}
      </AuthContext.Provider>
    )
  }


// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [authUser, setAuthUser] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [socket, setSocket] = useState(null);

//   // Set axios interceptor to add token to every request dynamically
//   useEffect(() => {
//     const interceptor = axios.interceptors.request.use(
//       (config) => {
//         const storedToken = localStorage.getItem("token");
//         if (storedToken) {
//           config.headers["token"] = storedToken;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     return () => {
//       axios.interceptors.request.eject(interceptor);
//     };
//   }, []);

//   // Check if the user is authenticated on app start
//   const checkAuth = async () => {
//     try {
//       const { data } = await axios.get("/api/auth/check");
//       if (data.success) {
//         setAuthUser(data.user);
//         connectSocket(data.user);
//       } else {
//         // If not successful, clear auth data
//         setAuthUser(null);
//         setToken(null);
//         localStorage.removeItem("token");
//       }
//     } catch (error) {
//       toast.error("Authentication failed. Please login.");
//       setAuthUser(null);
//       setToken(null);
//       localStorage.removeItem("token");
//     }
//   };

//   // Login function
//   const login = async (state, credentials) => {
//     try {
//       const { data } = await axios.post(`/api/auth/${state}`, credentials);
//       if (data.success) {
//         setAuthUser(data.userData);
//         setToken(data.token);
//         localStorage.setItem("token", data.token);
//         connectSocket(data.userData);
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setAuthUser(null);
//     setOnlineUsers([]);
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//     }
//     toast.success("Logged out successfully");
//   };

//   // Update profile function
//   const updateProfile = async (body) => {
//     try {
//       const { data } = await axios.put("/api/auth/update-profile", body);
//       if (data.success) {
//         setAuthUser(data.user);
//         toast.success("Profile updated successfully");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Connect to socket server and listen for online users
//   const connectSocket = (userData) => {
//     if (!userData || socket?.connected) return;
//     const newSocket = io(backendUrl, {
//       query: {
//         userId: userData._id,
//       },
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Socket connected:", newSocket.id);
//     });

//     newSocket.on("getOnlineUsers", (userIds) => {
//       setOnlineUsers(userIds);
//     });

//     // Handle socket disconnect on cleanup (optional)
//     newSocket.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setOnlineUsers([]);
//     });
//   };

//   // On component mount, check auth and setup axios headers
//   useEffect(() => {
//     if (token) {
//       checkAuth();
//     }
//   }, [token]);

//   const value = {
//     axios,
//     authUser,
//     onlineUsers,
//     socket,
//     login,
//     logout,
//     updateProfile,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
