const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const testHelper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');

// #############################
// GET /api/users
// #############################

describe('when there is non user in db', () => {
  test('creation fails with statuscode 400 without username', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      name: 'Muf Fin',
      password: 'secret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with statuscode 400 without password', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'muffin',
      name: 'Muf Fin',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password is invalid');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with statuscode 400 when username is too short', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'mu',
      name: 'Muf Fin',
      password: 'secret',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with statuscode 400 when password is too short', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'muffin',
      name: 'Muf Fin',
      password: 'se',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password is invalid');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe('when there is initially on user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({
      username: 'root',
      passwordHash,
    });

    await user.save();
  });

  test('creation succeeds with statuscode 201 and a fresh username', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'muffin',
      name: 'Muf Fin',
      password: 'secret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with statuscode 409 and message if username already taken', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
