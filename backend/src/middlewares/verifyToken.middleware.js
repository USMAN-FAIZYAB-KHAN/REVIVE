// import jwt from 'jsonwebtoken';
// import { generateAccessTokenFromRefreshToken } from '../utils/token.utils.js';
// import {asyncHandler} from '../utils/asyncHandler.js';
// import { ApiResponse } from '../utils/ApiResponse.js';

// const verifyToken = asyncHandler(async (req, res, next) => {
    
//     const token = req.header('Authorization')?.split(' ')[1] || req.cookies?.accessToken; 
//     if (!token) return res.status(403).json(new ApiResponse(403, null, 'Access denied'));
    

//     try {
//         const payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY); 
        
//         req.user = payload; 
//         return next(); 
//     } catch (err) {
        
//         const refreshToken = req.cookies?.refreshToken;
//         const newAccessToken = await generateAccessTokenFromRefreshToken(refreshToken); 

        
//         if (newAccessToken instanceof ApiResponse) {
//             return res.status(401).json(
//                 new ApiResponse(401, newAccessToken.data, newAccessToken.message)
//             );
//         }

        
//         const options = {
//             httpOnly: true,
//             secure: false,
//         };

//         res.cookie('accessToken', newAccessToken, options); 
//         req.user = jwt.verify(newAccessToken, process.env.ACCESS_SECRET_KEY); 
//         return next(); 
//     }
// });

// export default verifyToken;

import jwt from "jsonwebtoken";
import { generateAccessTokenFromRefreshToken } from "../utils/token.utils.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!accessToken) {
    return res.status(401).json(
      new ApiResponse(401, null, "Access token missing")
    );
  }

  try {
    const payload = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET_KEY
    );

    req.user = payload;
    next();
  } catch (err) {
    // ❗ Only refresh if token expired
    if (err.name !== "TokenExpiredError") {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid access token")
      );
    }

    const refreshToken =
      req.header("x-refresh-token") || req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json(
        new ApiResponse(401, null, "Refresh token missing")
      );
    }

    const newAccessToken =
      await generateAccessTokenFromRefreshToken(refreshToken);

    if (!newAccessToken) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid refresh token")
      );
    }

    // Send new token in header (mobile-friendly)
    res.setHeader("x-access-token", newAccessToken);

    req.user = jwt.verify(
      newAccessToken,
      process.env.ACCESS_SECRET_KEY
    );

    next();
  }
});

export default verifyToken;
