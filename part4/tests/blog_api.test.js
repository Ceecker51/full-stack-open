const mongoose = require('mongoose');
const supertest = require('supertest');

const testHelper = require('./test_helper');
const app = require('../app');
const api = supertest(app); // Wrap application into a superagent object

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = testHelper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

// #############################
// Formatting
// #############################

test('verify unique idenfitifier format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blog = response.body[0];
  expect(blog.id).toBeDefined();
});

// #############################
// GET /api/blogs
// #############################

test('all notes are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const titles = response.body.map((r) => r.title);

  expect(titles).toHaveLength(testHelper.initialBlogs.length);
  expect(titles).toContain('TDD harms architecture');
}, 100000);

afterAll(() => {
  mongoose.connection.close();
});
