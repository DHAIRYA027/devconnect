import mongoose from "mongoose";

// Comments are embedded in the post document. For a social feed this is a
// good fit: comments are always read together with their post, and a single
// post rarely accumulates thousands of comments.
const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    // Optional code snippet — DevConnect is for developers, after all.
    code: { type: String, default: "" },
    language: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Index for the common query: a user's posts newest-first.
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
