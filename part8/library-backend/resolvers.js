const { UserInputError, AuthenticationError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    allBooks: async (root, args) => {
      const filterArgs = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          throw new UserInputError(error.message, { invalidArgs: args });
        }

        filterArgs.author = author.id;
      }

      if (args.genre) {
        filterArgs.genres = { $in: [args.genre] };
      }

      return Book.find(filterArgs);
    },

    authorCount: () => Author.collection.countDocuments(),

    allAuthors: async (root, args) => {
      return Author.find({});
    },

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Book: {
    author: async (root) => {
      const author = Author.findById(root.author);
      return author;
    },
  },

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id });
      return books.length;
    },
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const author = await Author.findOne({ name: args.author });

      if (!author) {
        const author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new UserInputError('field "author" is not valid', {
              invalidArgs: args,
            });
          }

          throw new UserInputError(error.message, { invalidArgs: args });
        }
      }

      const book = new Book({ ...args, author: author.id });

      try {
        await book.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new UserInputError('field "title" is not valid', {
            invalidArgs: args,
          });
        }

        throw new UserInputError(error.message, { invalidArgs: args });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          {
            new: true,
            runValidators: true,
            context: "query",
          }
        );

        return updatedAuthor;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, { invalidArgs: args });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credendtials");
      }

      const userForToken = {
        id: user.id,
        username: user.username,
      };

      const token = jwt.sign(userForToken, config.JWT_SECRET);
      return { value: token };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
