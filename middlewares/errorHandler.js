// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
  
    // Customize the error response. You can also add more properties if needed.
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error'
    });
  };
  
  module.exports = errorHandler;

