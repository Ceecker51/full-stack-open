const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("./utils/config");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

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
// create and start apollo server
// ################################

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;

      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const decodedToken = jwt.decode(auth.substring(7), config.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);

        return { currentUser };
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({ app, path: "/" });

  httpServer.listen(config.PORT, () => {
    console.log(`Server is now running on http://localhost:${config.PORT}`);
  });
};

start();
