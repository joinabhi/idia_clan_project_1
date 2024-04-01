const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const mongoose = require('mongoose');
const { MONGODB } = require("./config.js");
const cors = require('cors');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startServer() {
    const app = express();

    // Apply the cors middleware
    app.use(cors({
        origin: '*', // Change this to your frontend URL in production
        credentials: true
    }));

    // Create an instance of ApolloServer
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req }),
    });

    // Start ApolloServer
    await server.start();

    // Apply ApolloServer middleware to Express
    server.applyMiddleware({ app });

    // Connect to MongoDB
    await mongoose.connect(MONGODB);
    
    // Start the Express server
    app.listen({ port: 7000 }, () =>
        console.log(`Server running at http://localhost:7000${server.graphqlPath}`)
    );
}

startServer().catch(err => {
    console.error(err);
});




