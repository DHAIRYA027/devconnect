import Post from "../models/Post.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notify.js";

const AUTHOR_FIELDS = "name username avatar";

// @route  POST /api/posts   — create a post
export const createPost = asyncHandler(async (req, res) => {
  const { text, code, language } = req.body;
  if (!text || !text.trim()) {
    res.statusCode = 400;
    throw new Error("Post text is required");
  }
  const post = await Post.create({ author: req.user._id, text, code, language });
  const populated = await post.populate("author", AUTHOR_FIELDS);
  res.status(201).json(populated);
});

// @route  GET /api/posts/feed   — posts from people you follow + yourself
export const getFeed = asyncHandler(async (req, res) => {
  const authorIds = [...req.user.following, req.user._id];
  const posts = await Post.find({ author: { $in: authorIds } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("author", AUTHOR_FIELDS)
    .populate("comments.author", AUTHOR_FIELDS);
  res.json(posts);
});

// @route  GET /api/posts/explore   — everyone's latest posts
export const getExplore = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("author", AUTHOR_FIELDS)
    .populate("comments.author", AUTHOR_FIELDS);
  res.json(posts);
});

// @route  GET /api/posts/user/:username
export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", AUTHOR_FIELDS)
    .populate("comments.author", AUTHOR_FIELDS);
  // Filter by populated author's username.
  res.json(posts.filter((p) => p.author?.username === req.params.username));
});

// @route  POST /api/posts/:id/like   — toggle like
export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.statusCode = 404;
    throw new Error("Post not found");
  }

  const userId = req.user._id;
  const alreadyLiked = post.likes.some((id) => id.equals(userId));

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => !id.equals(userId));
  } else {
    post.likes.push(userId);
    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "like",
      post: post._id,
    });
  }
  await post.save();
  res.json({ likes: post.likes, liked: !alreadyLiked });
});

// @route  POST /api/posts/:id/comment
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.statusCode = 400;
    throw new Error("Comment text is required");
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.statusCode = 404;
    throw new Error("Post not found");
  }

  post.comments.push({ author: req.user._id, text });
  await post.save();
  await post.populate("comments.author", AUTHOR_FIELDS);

  await createNotification({
    recipient: post.author,
    sender: req.user._id,
    type: "comment",
    post: post._id,
  });

  res.status(201).json(post.comments);
});

// @route  DELETE /api/posts/:id   — only the author may delete
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.statusCode = 404;
    throw new Error("Post not found");
  }
  if (!post.author.equals(req.user._id)) {
    res.statusCode = 403;
    throw new Error("You can only delete your own posts");
  }
  await post.deleteOne();
  res.json({ message: "Post deleted", id: req.params.id });
});
