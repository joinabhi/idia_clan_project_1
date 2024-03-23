// const {ApolloServer}=require("apollo-server")
// // const gql=require('graphql-tag');
// const mongoose=require('mongoose')

// const typeDefs = require('./graphql/typeDefs');
// const resolvers = require('./graphql/resolvers');

// const {MONGODB}=require("./config.js")

// const server=new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({ req }) => ({ req})
// })

// mongoose.connect(MONGODB)
//      .then(()=>{
//         console.log("mongoDb connected")
//          return server.listen({port:7000})
//      })
//      .then((res)=>{
//     console.log(`server running at ${res.url}`)
//     })
//     .catch(err => {
//         console.error(err)
//       })
// const express = require('express');
// const { ApolloServer } = require("apollo-server-express");
// const mongoose = require('mongoose');
// const { MONGODB } = require("./config.js");
// const cors = require('cors');

// const typeDefs = require('./graphql/typeDefs');
// const resolvers = require('./graphql/resolvers');

// // Create an Express app
// const app = express();

// // Apply the cors middleware
// app.use(cors({
//     origin: '*', // Change this to your frontend URL in production
//     credentials: true
// }));

// // Create an instance of ApolloServer
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({ req }) => ({ req }),
// });

// // Apply ApolloServer middleware to Express
// server.applyMiddleware({ app });

// // Connect to MongoDB
// mongoose.connect(MONGODB)
//     .then(() => {
//         console.log("MongoDB connected");
//         // Start the Express server
//         app.listen({ port: 7000 }, () =>
//             console.log(`Server running at http://localhost:7000${server.graphqlPath}`)
//         );
//     })
//     .catch(err => {
//         console.error(err);
//     });


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




