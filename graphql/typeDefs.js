const {gql}=require("apollo-server")

module.exports = gql`
type Post{
id: ID!
body:String!
createdAt:String!
username:String!
user:ID!
}

type User {
    id: ID!
    email: String!
    token: String!
    password:String!
    username: String!
    createdAt: String!
   }

type Follow {
  id:ID!
  follower:ID!
  following:ID!
  createdAt: String!
}

type Like{
  id:ID!
  follower:ID!
  following:ID!
  createdAt: String!
}

input RegisterInput {
    username: String!
    password: String!
    email: String!
  }

type Query{
    getUsers:[User]
    getPosts:[Post]
    getPost(postId: ID!): Post
    getFollowedPosts:[Post]
    getFollower(following:ID!):[Follow]
    getLike(following:ID!):[Like]
}

type Mutation{
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    followUser(followingId:ID!, followerId:ID!):User!
    unfollowUser(followingId:ID!, followerId:ID!):User!
    likeUser(followingId:ID!, followerId:ID!):User!
    unlikeUser(followingId:ID!, followerId:ID!):User!
}
`;



