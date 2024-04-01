const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/post")


const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 })

        return posts
      } catch {
        throw new Error(err)
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }

  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        console.log("51", post)
        console.log("52", user)
        if (user.username === post.username) {
          await Post.deleteOne({ _id: postId });
          return "post deleted successfully"
        } else {
          throw new AuthenticationError("Action not allowed")
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }
};

// GTzsVNxZHMP4CmMR