import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notify.js";

const PUBLIC_FIELDS = "name username avatar bio githubUrl skills followers following createdAt";

// @route  GET /api/users/:username  — public profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select(PUBLIC_FIELDS)
    .populate("followers", "name username avatar")
    .populate("following", "name username avatar");
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found");
  }
  res.json(user);
});

// @route  PUT /api/users/me  — update own profile
export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "avatar", "githubUrl", "skills"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: req.user });
});

// @route  POST /api/users/:id/follow  — toggle follow
export const toggleFollow = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === String(req.user._id)) {
    res.statusCode = 400;
    throw new Error("You cannot follow yourself");
  }

  const target = await User.findById(targetId);
  if (!target) {
    res.statusCode = 404;
    throw new Error("User not found");
  }

  const alreadyFollowing = req.user.following.some((id) => id.equals(targetId));

  if (alreadyFollowing) {
    req.user.following = req.user.following.filter((id) => !id.equals(targetId));
    target.followers = target.followers.filter((id) => !id.equals(req.user._id));
  } else {
    req.user.following.push(targetId);
    target.followers.push(req.user._id);
    await createNotification({
      recipient: target._id,
      sender: req.user._id,
      type: "follow",
    });
  }

  await Promise.all([req.user.save(), target.save()]);
  res.json({ following: !alreadyFollowing, followersCount: target.followers.length });
});

// @route  GET /api/users  — search / suggestions (?q=term)
export const searchUsers = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { username: { $regex: q, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(filter)
    .select("name username avatar bio")
    .limit(20);
  res.json(users);
});
