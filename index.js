const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const typeDefs = require("./server/typeDefs/typeDefs");
const resolvers = require("./server/resolvers");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
