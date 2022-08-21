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
  const groupByBlogs = blogs.reduce((acc, it) => {
    acc[it.author] = acc[it.author] + 1 || 1;
    return acc;
  }, {});

  const maxEntry = Object.entries(groupByBlogs).reduce((prev, curr) =>
    prev[1] > curr[1] ? prev : curr
  );

  return {
    author: maxEntry[0],
    blogs: maxEntry[1],
  };
};

const mostLikes = (blogs) => {
  const groupByLikes = blogs.reduce((acc, it) => {
    acc[it.author] = acc[it.author] + it.likes || it.likes;
    return acc;
  }, {});

  const maxEntry = Object.entries(groupByLikes).reduce((prev, curr) =>
    prev[1] > curr[1] ? prev : curr
  );

  return {
    author: maxEntry[0],
    likes: maxEntry[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
