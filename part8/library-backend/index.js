const mongoose = require("mongoose");
const { ApolloServer, gql, UserInputError } = require("apollo-server");
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const config = require("./utils/config");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

// ################################
// Connect to database
// ################################

console.log("connect to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

// ################################
// Configure GraphQL schemas
// ################################

const typeDefs = gql`
  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Token {
    value: String!
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    bookCount: Int!

    allAuthors: [Author!]!
    authorCount: Int!

    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
  }
`;

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

        filterArgs.author = author._id;
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
      const books = await Book.find({ author: root._id });
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

      const book = new Book({ ...args, author: author._id });

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
      const user = new User({ username: args.username });
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
        id: user._id,
        username: user.username,
      };

      const token = jwt.sign(userForToken, config.JWT_SECRET);
      return { value: token };
    },
  },
};

// ################################
// create and start apollo server
// ################################

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.decode(auth.substring(7), config.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);

      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
