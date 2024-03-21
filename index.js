const {ApolloServer}=require("apollo-server")
// const gql=require('graphql-tag');
const mongoose=require('mongoose')

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const {MONGODB}=require("./config.js")

const server=new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req})
})

mongoose.connect(MONGODB)
     .then(()=>{
        console.log("mongoDb connected")
         return server.listen({port:7000})
     })
     .then((res)=>{
    console.log(`server running at ${res.url}`)
    })
    .catch(err => {
        console.error(err)
      })