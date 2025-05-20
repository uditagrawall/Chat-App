// import User from "../models/User.js";
// import jwt from "jsonwebtoken";


// // Middleware to protect routes
// export const protectRoute = async (req, res, next)=> {
//   try {
//     const token = req.headers.token;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)


//     const user = await User.findById(decoded.userId).select("-password");

//     if(!user) return res.json({success: false, message: "User not found "});

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error.message);
    
//     res.json({success: false, message: error.message});
//   }
// }

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};
