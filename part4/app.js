const config = require('./utils/config');

const express = require('express');
require('express-async-errors');
const cors = require('cors');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const mongoose = require('mongoose');

// ########################
// Connect to database
// ########################

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI);

// ########################
// Create express application
// ########################

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
