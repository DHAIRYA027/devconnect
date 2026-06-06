# DevConnect — Interview Talking Points

Keep this for yourself (don't necessarily commit it). These are the things
interviewers love to dig into. Be ready to explain *why*, not just *what*.

## 30-second pitch
> "DevConnect is a full-stack social network for developers — think a mini
> Twitter for code. Users post updates with code snippets, follow each other,
> and get **real-time notifications** when someone likes, comments, or follows
> them. I built it with the MERN stack and Socket.io for the realtime layer."

## Questions you should be able to answer

**1. How does authentication work?**
- On register/login the server issues a **JWT** signed with a secret.
- The client stores it in `localStorage` and an Axios **interceptor** attaches it
  as a `Bearer` token on every request.
- A `protect` middleware verifies the token and loads the user before protected routes.
- Passwords are hashed with **bcrypt** (salted) in a Mongoose `pre('save')` hook.
- *Follow-up they may ask:* "Is localStorage safe?" → Tradeoff: simple, but vulnerable
  to XSS. A production app might use httpOnly cookies. Good to acknowledge this.

**2. How do real-time notifications work?**
- Server wraps Express in an `http` server so **Socket.io shares the same port**.
- The socket handshake is **authenticated with the same JWT** as the REST API.
- I keep a `Map` of `userId → Set<socketId>` (a user can have multiple tabs open).
- When someone likes/comments/follows, the server creates a Notification document
  AND emits `notification:new` to that user's sockets. The navbar badge updates live.

**3. Why MongoDB? How did you model the data?**
- Three collections: `User`, `Post`, `Notification`.
- **Comments are embedded** inside Post documents — they're always fetched with the
  post and a single post won't have millions of comments.
- **Likes and the follow graph are referenced** (arrays of ObjectIds) for flexibility.
- I added **indexes** on common query patterns (e.g. `{ author, createdAt }`).
- *Tradeoff to mention:* storing followers/following as arrays is simple and fast to
  read, but wouldn't scale to celebrity accounts with millions of followers — you'd
  move to a dedicated edges collection then.

**4. How does the feed work?**
- `GET /posts/feed` finds posts where `author ∈ (people I follow + me)`, sorted
  newest-first, limited to 50, with authors + comment authors populated.

**5. What's the optimistic UI bit?**
- When you like a post, the heart fills **instantly** before the server responds,
  then reconciles with the real like list from the response (rolls back on error).

## Things you can say you'd improve (shows maturity)
- Move JWT to httpOnly cookies; add refresh tokens.
- Pagination / infinite scroll on the feed instead of a 50-post limit.
- Image uploads (currently avatars are URLs) via S3 / Cloudinary.
- Add tests (Jest + Supertest for the API).
- Rate limiting and input sanitization for production.

## Stuff to practice doing live
- Walk through the request lifecycle of "liking a post" end to end.
- Draw the data models on a whiteboard.
- Open two browser tabs and demo a notification appearing in real time. ✨
