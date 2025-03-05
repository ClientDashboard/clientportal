// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error stack for debugging
  console.error(`[${new Date().toISOString()}] ❌ ERROR:`, err.stack);

  // Define a default status code (500 if not provided)
  const statusCode = err.status || 500;

  // Hide internal errors in production
  const responseMessage =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message;

  // Send structured JSON response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: responseMessage
  });
};

module.exports = errorHandler;
