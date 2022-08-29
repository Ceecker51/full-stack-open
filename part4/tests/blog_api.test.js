const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const testHelper = require('./test_helper');
const app = require('../app');
const api = supertest(app); // Wrap application into a superagent object

const Blog = require('../models/blog');
const User = require('../models/user');

let loggedInToken = '';

beforeEach(async () => {
  // Add users to db
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const userObject = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  });

  const user = await userObject.save();

  // Add blogs to db
  await Blog.deleteMany({});

  const blogObjects = testHelper.initialBlogs.map((blog) => {
    const blogObj = new Blog(blog);
    blogObj.user = user._id;
    return blogObj;
  });
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

// #############################
// Formatting
// #############################

describe('Formatting', () => {
  test('verify unique idenfitifier format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blog = response.body[0];
    expect(blog.id).toBeDefined();
  });
});

// #############################
// GET /api/blogs
// #############################

describe('GET /api/blogs', () => {
  test('all notes are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const titles = response.body.map((r) => r.title);

    expect(titles).toHaveLength(testHelper.initialBlogs.length);
    expect(titles).toContain('TDD harms architecture');
  }, 100000);
});

// #############################
// POST /api/blogs
// #############################

describe('POST /api/blogs', () => {
  beforeEach(async () => {
    const username = 'root';
    const password = 'sekret';

    const response = await api.post('/api/login').send({
      username,
      password,
    });

    loggedInToken = response.body.token;
  });

  test('a blog post can be added', async () => {
    const newBlog = {
      title: 'Learning JavaScript Design Patterns',
      author: 'Addy Osmani',
      url: 'https://www.patterns.dev/posts/classic-design-patterns/',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('Learning JavaScript Design Patterns');
  });

  test('blog post without likes property is set to zero', async () => {
    const newBlog = {
      title: 'Learning JavaScript Design Patterns',
      author: 'Addy Osmani',
      url: 'https://www.patterns.dev/posts/classic-design-patterns/',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blog = response.body;

    expect(blog.likes).toBeDefined();
    expect(blog.likes).toBe(0);
  });

  test('blog without title and url properties is not added', async () => {
    const newBlog = {
      author: 'Addy Osmani',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInToken}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length);
  });

  test('add blog post with invalid token', async () => {
    const newBlog = {
      title: 'Learning JavaScript Design Patterns',
      author: 'Addy Osmani',
      url: 'https://www.patterns.dev/posts/classic-design-patterns/',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length);
  });
});

// #############################
// DELETE /api/blogs/:id
// #############################

describe('DELETE /api/blogs/:id', () => {
  beforeEach((done) => {
    const username = 'root';
    const password = 'sekret';

    api
      .post('/api/login')
      .send({
        username,
        password,
      })
      .end((err, response) => {
        loggedInToken = response.body.token;
        done();
      });
  });

  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await testHelper.blogsInDb();
    const blogToDelete = blogAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${loggedInToken}`)
      .expect(204);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('fails with status code 404 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `bearer ${loggedInToken}`)
      .expect(404);
  });
});

// #############################
// PUT /api/blogs/:id
// #############################

describe('PUT /api/blogs/:id', () => {
  test('succeeds with status code 200 if blog is valid', async () => {
    const blogAtStart = await testHelper.blogsInDb();
    const blogToUpdate = blogAtStart[0];

    blogToUpdate.title = 'This is a updated title';
    blogToUpdate.likes = 20;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length);

    const blogUpdated = blogsAtEnd.find((blog) => blogToUpdate.id === blog.id);
    expect(blogUpdated.title).toEqual('This is a updated title');
    expect(blogUpdated.likes).toBe(20);
  });

  test('fails with status code 404 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.put(`/api/blogs/${invalidId}`).expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
