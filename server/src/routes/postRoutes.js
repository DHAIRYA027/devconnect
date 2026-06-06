import { Router } from "express";
import {
  createPost,
  getFeed,
  getExplore,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.get("/explore", protect, getExplore);
router.get("/user/:username", protect, getUserPosts);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);

export default router;
