const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

//create  token for request body logging (be careful with sensitive data)
morgan.token('body', (req) => {
  //oly log the body for specific routes or methods if needed
  //avoid logging sensitive information like passwords
  const sensitiveRoutes = ['/api/auth/login', '/api/auth/register'];
  if (sensitiveRoutes.includes(req.originalUrl)) {
    return JSON.stringify({ message: 'Body contains sensitive information' });
  }
  return JSON.stringify(req.body);
});

//create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'),
  { flags: 'a' }
);

//development logging
const developmentLogger = morgan((tokens, req, res) => {
  return [
     //colors for better visibility
    '\x1b[36m',
    tokens.method(req, res),
    '\x1b[0m',
    tokens.url(req, res),
    '\x1b[33m',
    tokens.status(req, res),
    '\x1b[0m',
    '\x1b[32m',
    tokens['response-time'](req, res), 'ms',
    '\x1b[0m',
    tokens.body(req, res)
  ].join(' ');
});

//production logging to file
const productionLogger = morgan('combined', {
  stream: accessLogStream,
  //skip function to filter out certain requests if needed
  skip: function (req, res) { 
    //skip logging for successful health check endpoints
    return req.url === '/health' && res.statusCode === 200;
  }
});

//choose the appropriate logger based on environment
const getLogger = () => {
  //ensure the logs directory exists
  try {
    fs.mkdirSync(path.join(__dirname, '../logs'), { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error creating logs directory:', err);
    }
  }

  //return different loggers based on environment
  if (process.env.NODE_ENV === 'production') {
    return productionLogger;
  } else {
    return developmentLogger;
  }
};

module.exports = getLogger;