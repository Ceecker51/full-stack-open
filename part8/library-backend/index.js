const mongoose = require("mongoose");
const { ApolloServer, gql, UserInputError } = require("apollo-server");
const { v1: uuid } = require("uuid");

const config = require("./utils/config");

const Author = require("./models/author");
const Book = require("./models/Book");

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];

// let books = [
//   {
//     title: "Clean Code",
//     published: 2008,
//     author: "Robert Martin",
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Agile software development",
//     published: 2002,
//     author: "Robert Martin",
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ["agile", "patterns", "design"],
//   },
//   {
//     title: "Refactoring, edition 2",
//     published: 2018,
//     author: "Martin Fowler",
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Refactoring to patterns",
//     published: 2008,
//     author: "Joshua Kerievsky",
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "patterns"],
//   },
//   {
//     title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//     published: 2012,
//     author: "Sandi Metz",
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "design"],
//   },
//   {
//     title: "Crime and punishment",
//     published: 1866,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "crime"],
//   },
//   {
//     title: "The Demon ",
//     published: 1872,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "revolution"],
//   },
// ];

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

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    bookCount: Int!

    allAuthors: [Author!]!
    authorCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
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
  },
  Book: {
    author: async (root) => {
      const author =  Author.findById(root.author);
      return author;
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({author: root._id});
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author });

      if (!author) {
        const author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
         
          if (error.name === 'ValidationError') {
            throw new UserInputError('field "author" is not valid', { invalidArgs: args });
          }

          throw new UserInputError(error.message, { invalidArgs: args });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        await book.save();
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new UserInputError('field "title" is not valid', { invalidArgs: args });
        }

        throw new UserInputError(error.message, { invalidArgs: args });
      }

      return book;
    },
    editAuthor: async (root, args) => {
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
  },
};

// ################################
// create and start apollo server
// ################################

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
