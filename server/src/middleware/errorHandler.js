// Central error handler. Controllers can `throw` and it lands here, so we
// don't repeat try/catch JSON formatting everywhere.
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  // Mongoose duplicate key (e.g. username/email already taken)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `That ${field} is already taken` });
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((e) => e.message)[0];
    return res.status(400).json({ message: msg });
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error(err);
  res.status(status).json({ message: err.message || "Server error" });
};
