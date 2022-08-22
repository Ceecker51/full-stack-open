const testHelper = require('./test_helper');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const result = listHelper.dummy([]);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([testHelper.initialBlogs[1]]);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testHelper.initialBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('blog with most likes', () => {
    const obj = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };

    const result = listHelper.favoriteBlog(testHelper.initialBlogs);
    expect(result).toEqual(obj);
  });
});

describe('most blogs', () => {
  test('author with most blogs', () => {
    const obj = {
      author: 'Robert C. Martin',
      blogs: 3,
    };

    const result = listHelper.mostBlogs(testHelper.initialBlogs);
    expect(result).toEqual(obj);
  });
});

describe('most likes', () => {
  test('author with most likes', () => {
    const obj = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };

    const result = listHelper.mostLikes(testHelper.initialBlogs);
    expect(result).toEqual(obj);
  });
});
