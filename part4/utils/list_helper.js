const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  const { title, author, likes } = blogs.reduce((prev, curr) =>
    prev.likes > curr.likes ? prev : curr
  );

  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const authorBlogs = {};

  for (const blog of blogs) {
    if (!authorBlogs[blog.author]) {
      authorBlogs[blog.author] = 0;
    }

    authorBlogs[blog.author] = authorBlogs[blog.author] + 1;
  }

  const maxEntry = Object.entries(authorBlogs).reduce((prev, curr) =>
    prev.blogs > curr.blogs ? prev : curr
  );

  return {
    author: maxEntry[0],
    blogs: maxEntry[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
