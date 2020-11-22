const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const typeDefs = require("./src/typeDefs/typeDefs");
const resolvers = require("./src/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
