const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security HTTP headers
app.use(helmet());

// prevent **** attack
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: {
    message: 'Too many requests, try again in an hour',
    status: 'warning',
  },
});

app.use('/api', limiter);

const userRouter = require('./routes/userRoutes');
app.use('/api/v1/users', userRouter);

const errorHandler = require('./controllers/errorController');
app.use(errorHandler);

module.exports = app;
