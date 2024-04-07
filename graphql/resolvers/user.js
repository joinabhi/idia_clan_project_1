const User = require('../../models/user')
const Follow = require('../../models/follow')
const Like = require('../../models/like')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require('../../util/check-auth');

const { validateRegisterInput, validateLoginInput } = require("../../util/validators")

const { SECRET_KEY } = require('../../config');
const { UserInputError } = require('apollo-server');
const follow = require('../../models/follow');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}


module.exports = {
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ email });
      console.log("user in login", user)

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);
      console.log("QWERTYUIOP", token)

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },

    async register(_, { registerInput: { username, email, password } }) {
      // TODO: Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is already registered'
          }
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        email: email,
        username: username,
        password: hashedPassword, // Use 'password' field here
        createdAt: new Date().toISOString()
      });

      // Save the new user
      const savedUser = await newUser.save();

      console.log("129-------->", savedUser)
      // Generate token
      const token = generateToken(savedUser);
      console.log("token&&&&", token)

      console.log(savedUser._id, savedUser.email, savedUser.username, savedUser.createdAt, token)
      return {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        createdAt: savedUser.createdAt,
        token: token
      };
    },

    async followUser(_, { followingId, followerId }) {
      console.log("followingId, followerId", followingId, followerId)
      try {
        // Check if the user is already being followed
        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
        console.log('117----->existingFollowerUser', existingFollow)
        if (existingFollow) {
          throw new Error('User is already being followed');
        }

        const follow = new Follow({
          follower: followerId,
          following: followingId
        });
        console.log('126----,.,.,.follow', follow)
        await follow.save();

        return await User.findById(followerId);
      } catch (error) {
        throw error;
      }
    },

    async unfollowUser(_, { followingId, followerId }) {
      try {
        // Check if the user is being followed
        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
        if (!existingFollow) {
          throw new Error('User is not being followed');
        }

        await Follow.findByIdAndDelete(existingFollow._id);
        return await User.findById(followerId);
      } catch (error) {
        throw error;
      }
    },
  


  async likeUser(_, { followingId, followerId }) {
    console.log("followingId, followerId", followingId, followerId)
    try {
      // Check if the user is already being followed
      const existingLike = await Like.findOne({ follower: followerId, following: followingId });
      console.log('117&&&&&&&&&&&&&&&&&&&&----->existinglikeUser', existingLike)
      if (existingLike) {
        throw new Error('User is already being liked');
      }

      const like = new Like({
        follower: followerId,
        following: followingId
      });
      console.log('126----,.,.,.like', like)
      await like.save();

      return await User.findById(followerId);
    } catch (error) {
      throw error;
    }
  },

  async unlikeUser(_, { followingId, followerId }) {
    try {
      // Check if the user is being followed
      const existingLike = await Like.findOne({ follower: followerId, following: followingId });
      if (!existingLike) {
        throw new Error('User is not being followed');
      }

      await Like.findByIdAndDelete(existingLike._id);
      return await User.findById(followerId);
    } catch (error) {
      throw error;
    }
  }


},



Query: {
    async getUsers() {
    try {
      const users = await User.find().sort({ created: -1 });
      console.log("Users in getUsers:", users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error.message);
      throw new Error("Failed to fetch users.");
    }
  },

    async getFollower(_, { following }){
    try {
      console.log('Querying followers for following ID:', following);
      const follower = await Follow.find({ following }).sort({ created: -1 });
      console.log('followers of specific user', follower)
      return follower;
    } catch (error) {
      console.error("Error fetching users:", error.message)
      throw new Error("Failed to fetch users")
    }
  },

  async getLike(_, { following }){
    try {
      console.log('Querying followers for following ID:', following);
      const follower = await Like.find({ following }).sort({ created: -1 });
      console.log('followers of specific user', follower)
      return follower;
    } catch (error) {
      console.error("Error fetching users:", error.message)
      throw new Error("Failed to fetch users")
    }
  }

}
}