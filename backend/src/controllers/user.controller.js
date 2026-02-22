import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { generateToken, generateAccessTokenFromRefreshToken } from '../utils/token.utils.js';
import { OAuth2Client } from "google-auth-library";



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const userRegistration = asyncHandler(async (req, res) => {
  const {authType, email, fullName, role, password, confirmPassword } = req.body;

  

  if (![email, fullName, password, confirmPassword].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  const normalizedEmail = email.trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  console.log(existingUser);
  if (existingUser) {
    return res.json(new ApiResponse(409, null, "Email already in use"));
  }

  if (password !== confirmPassword) {
    return res.json(new ApiResponse(400, null, "Passwords do not match"));
  }

  const user = await User.create({
    email: normalizedEmail,
    fullName: fullName.trim(),
    userType: role.toLowerCase().trim(),
    password,
    authProviders: ["local"],
    isEmailVerified: false,
  });

  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken -googleId"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, safeUser, "User registered successfully"));
});


export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    throw new ApiError(400, "Google token is required");
  }

  // 1️⃣ Verify token with Google
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const {
    email,
    sub: googleId,
    name,
    email_verified,
  } = payload;

  if (!email_verified) {
    throw new ApiError(401, "Google email not verified");
  }

  const normalizedEmail = email.trim();

  // 2️⃣ Check if user already exists
  let user = await User.findOne({ email: normalizedEmail });

  // 🆕 Case A: User does NOT exist → CREATE
  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      fullName: name,
      userType: role.toLowerCase().trim(),
      googleId,
      authProviders: ["google"],
      isEmailVerified: true,
      password: null,
    });
  }

  // 🔗 Case B: User exists but Google not linked → LINK
  if (!user.authProviders.includes("google")) {
    user.googleId = googleId;
    user.authProviders.push("google");
    user.isEmailVerified = true;
    await user.save();
  }

  // 3️⃣ Generate tokens
  const { accessToken, refreshToken } = await generateToken(
    user._id,
    user.email
  );

  user.refreshToken = refreshToken;
  await user.save();

  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken -googleId"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { user: safeUser, accessToken, refreshToken },
      "Google authentication successful"
    )
  );
});



export const login = asyncHandler(async (req, res) => {
    const { email, password, authType, idToken } = req.body;
    console.log(req.body);

    if (!authType) {
        return res.json(new ApiResponse(400, null, "Authentication type is required"));
    }

    let user;

    // =========================
    // LOCAL LOGIN
    // =========================
    if (authType === "local" || authType === "manual") {
      if ([email, password].some((f) => !f || f.trim() === "")) {
        return res.json(new ApiResponse(400, null, "Email and password are required"));
      }
      
      user = await User.findOne({ email });
      
      if (!user) {
        
        return res.json(new ApiResponse(404, null, "User not found"));
      }
      
      if (user.authType === "google") {
        return res.json(new ApiResponse(400, null, "Please login using Google authentication"));
      }
      
      const isValid = await user.comparePassword(password);
      console.log("Password valid:", isValid);
      if (!isValid) {
        return res.json(new ApiResponse(401, null, "Invalid credentials"));
      }
      console.log("Auth Type:", authType);
    }
    
    // =========================
    // GOOGLE LOGIN
    // =========================
    if (authType === "google") {
        if (!idToken) {
            return res.json(new ApiResponse(400, null, "Google ID token is required"));
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleEmail = payload.email;
        const fullName = payload.name;

        user = await User.findOne({ email: googleEmail });

        // 👇 If user does not exist → CREATE
        if (!user) {
            user = await User.create({
                email: googleEmail,
                fullName,
                authType: "google",
                password: "GOOGLE_AUTH", // dummy (won’t be used)
            });
        }
    }

    // =========================
    // TOKEN GENERATION
    // =========================
    const { accessToken, refreshToken } = await generateToken(
        user._id,
        user.email
    );

    user.refreshToken = refreshToken;
    await user.save();

    

    return res
        .status(200)
        
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});


export const getMe = asyncHandler(async(req,res)=>{
    try {
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

   console.log("Authenticated user:", req.user);
    res.status(200).json(
      new ApiResponse(
                200,
                { user: req.user},
                "User Authenticated Successfully"
            )
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
})

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  // If no refresh token, still clear cookies
  if (refreshToken) {
    await User.updateOne(
      { refreshToken },
      { $set: { refreshToken: null } }
    );
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true, // true in production (HTTPS)
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});