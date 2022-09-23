const blogRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comments');

const { userExtractor } = require('../utils/middleware');

// ############################
// Endpoints
// ############################

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate([
    {
      path: 'user',
      select: { username: 1, name: 1 },
    },
    {
      path: 'comments',
      select: { text: 1 },
    },
  ]);
  response.json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;

  if (!body.title && !body.url) {
    return response.status(400).end();
  }

  const user = await User.findById(request.userid);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  savedBlog.populate([
    {
      path: 'user',
      select: { username: 1, name: 1 },
    },
    {
      path: 'comments',
      select: { text: 1 },
    },
  ]);

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== request.userid.toString()) {
      return response.status(401).json({
        error: 'blog can only deleted by the user who added the blog.',
      });
    }

    await Blog.findByIdAndRemove(blog._id);

    const user = await User.findById(request.userid);
    user.blogs = user.blogs.filter((id) => id !== blog.id);
    await user.save();

    response.status(204).end();
  } catch (exception) {
    response.status(404).end();
  }
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    }).populate([
      {
        path: 'user',
        select: { username: 1, name: 1 },
      },
      {
        path: 'comments',
        select: { text: 1 },
      },
    ]);

    response.status(201).json(updatedBlog);
  } catch (exception) {
    response.status(404).end();
  }
});

blogRouter.post('/:id/comments', async (request, response) => {
  const body = request.body;

  if (!body.text) {
    return response.status(400).end();
  }

  const blog = await Blog.findById(request.params.id);

  const comment = new Comment({
    text: body.text,
  });
  const savedComment = await comment.save();

  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();

  response.status(201).json(savedComment);
});

module.exports = blogRouter;
