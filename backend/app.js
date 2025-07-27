var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const setupSwagger = require('./swagger');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const menuRouter = require('./routes/menu');
const orderRouter = require('./routes/order');
const receiptRouter = require('./routes/receipt');

var app = express();

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe-order-sweet-receipts';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', orderRouter);
app.use('/api/receipts', receiptRouter);
setupSwagger(app);

module.exports = app;
