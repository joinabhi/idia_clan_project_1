const {gql}=require("apollo-server")

module.exports = gql`
type Post{
id: ID!
body:String!
createdAt:String!
username:String!
}

type User {
    id: ID!
    email: String!
    token: String!
    password:String!
    username: String!
    createdAt: String!
  }

input RegisterInput {
    username: String!
    password: String!
    email: String!
  }

  

type Query{
    getPosts:[Post]
    getPost(postId: ID!): Post
}

type Mutation{
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
}
`;


// const { gql } = require("apollo-server");

// module.exports = gql`
//   type Post {
//     id: ID!
//     body: String!
//     createdAt: String!
//     username: String!
//   }

//   type User {
//     id: ID!
//     email: String!
//     username: String!
//     createdAt: String!
//   }

//   input RegisterInput {
//     username: String!
//     password: String!
//     email: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User! # Optionally, you can include user information along with the token
//   }

//   type Query {
//     getPosts: [Post]
//     getPost(postId: ID!): Post
//   }

//   type Mutation {
//     register(registerInput: RegisterInput): AuthPayload! # Use AuthPayload as return type
//     login(email: String!, password: String!): AuthPayload! # Use AuthPayload as return type
//     createPost(body: String!): Post!
//     deletePost(postId: ID!): String!
//   }
// `;
