// Importing necessary modules and files
const express = require('express');
const path = require('path'); // Path module for working with file and directory paths
const db = require('./config/connection');
// const routes = require('./routes');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas'); // GraphQL utils type definitions and resolvers

// Creating an Express app
const app = express(); // instance
const PORT = process.env.PORT || 3001;

// For the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Configuring Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Setting up a route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Starting the Apollo Server and the Express app
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
// Listen ports
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer();


// app.use(routes);
