const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const getLogger = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

//load environment variables
dotenv.config();

//connect to database
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//apply request logger
app.use(getLogger());

//routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

//root route
app.get('/', (req, res) => {
  res.send(`API is running on port ${process.env.PORT}...`);
});

// error handling middleware
app.use(notFound);
app.use(errorHandler);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runninnng in ${process.env.NODE_ENV} mode on port ${PORT}`);
});