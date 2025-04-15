//middleware for handling 404 not found errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
  
  //error handling middleware
const errorHandler = (err, req, res, next) => {
  //if status code is 200, set it to 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
  
module.exports = { notFound, errorHandler };