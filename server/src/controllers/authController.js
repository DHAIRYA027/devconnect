import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

// Shape the user object we send to the client (never expose the password).
const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  username: u.username,
  email: u.email,
  bio: u.bio,
  avatar: u.avatar,
  githubUrl: u.githubUrl,
  skills: u.skills,
  followers: u.followers,
  following: u.following,
  createdAt: u.createdAt,
});

// @route  POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    res.statusCode = 400;
    throw new Error("Name, username, email and password are all required");
  }

  const user = await User.create({ name, username, email, password });
  res.status(201).json({ user: publicUser(user), token: generateToken(user._id) });
});

// @route  POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // password has select:false, so we ask for it explicitly here.
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.statusCode = 401;
    throw new Error("Invalid email or password");
  }

  res.json({ user: publicUser(user), token: generateToken(user._id) });
});

// @route  GET /api/auth/me  (returns the currently logged-in user)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});
