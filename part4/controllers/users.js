const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1});
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  // validate username
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(409).json({ error: 'username must be unique' });
  }

  // validate password
  if (!(password && password.length >= 3)) {
    return response.status(400).json({ error: 'password is invalid' });
  }

  // calculate hash of password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // create new user
  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
