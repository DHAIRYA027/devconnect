import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

// Seeds the database with demo users and posts so the app looks alive
// in a portfolio demo. Run with: npm run seed
// All demo accounts share the password: password123

const demoUsers = [
  {
    name: "Aisha Khan",
    username: "aisha",
    email: "aisha@demo.dev",
    bio: "Frontend dev who loves React & design systems ✨",
    skills: ["React", "TypeScript", "CSS", "Figma"],
    githubUrl: "https://github.com/aisha",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Rahul Verma",
    username: "rahul",
    email: "rahul@demo.dev",
    bio: "Backend engineer. Node, databases, and clean APIs.",
    skills: ["Node.js", "MongoDB", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com/rahul",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Mei Lin",
    username: "mei",
    email: "mei@demo.dev",
    bio: "ML student exploring LLMs and computer vision 🤖",
    skills: ["Python", "PyTorch", "NumPy"],
    githubUrl: "https://github.com/mei",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log("🧹 Cleared existing data");

  // create() triggers the pre-save hook so passwords get hashed.
  const users = await Promise.all(
    demoUsers.map((u) => User.create({ ...u, password: "password123" }))
  );
  const [aisha, rahul, mei] = users;

  // Build a small follow graph.
  aisha.following.push(rahul._id, mei._id);
  rahul.followers.push(aisha._id);
  mei.followers.push(aisha._id);
  rahul.following.push(aisha._id);
  aisha.followers.push(rahul._id);
  await Promise.all([aisha.save(), rahul.save(), mei.save()]);

  const posts = await Post.create([
    {
      author: rahul._id,
      text: "Just shipped a rate-limiter middleware for our API. Token bucket > fixed window, change my mind 🪣",
    },
    {
      author: mei._id,
      text: "Fine-tuned my first small model today. Loss curve finally going down 📉 small wins!",
    },
    {
      author: aisha._id,
      text: "Quick tip: useMemo is not free. Profile before you optimize. Here's a hook I use a lot:",
      code: "const value = useMemo(() => expensiveCalc(data), [data]);",
      language: "javascript",
    },
    {
      author: rahul._id,
      text: "Hot take: most apps don't need microservices. A well-structured monolith will take you very far.",
    },
  ]);

  // A couple of likes & comments for realism.
  posts[0].likes.push(aisha._id, mei._id);
  posts[0].comments.push({ author: aisha._id, text: "Token bucket gang 🙌" });
  await posts[0].save();

  console.log(`✅ Seeded ${users.length} users and ${posts.length} posts`);
  console.log("👉 Log in with  aisha@demo.dev  /  password123");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
