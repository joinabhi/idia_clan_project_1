const User=require('../../models/user')
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const {validateRegisterInput, validateLoginInput}=require("../../util/validators")

const {SECRET_KEY}=require('../../config');
const { UserInputError } = require('apollo-server');

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

module.exports={
    Mutation:{
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
      
            if (!valid) {
              throw new UserInputError('Errors', { errors });
            }
      
            const user = await User.findOne({ username });
      
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
      
            return {
              ...user._doc,
              id: user._id,
              token
            };
          },
       async register(_,
            {
                registerInput:{username, email, password}
            }, 
       
            ){
            //TODO:validate user data
            const {valid, errors}=validateRegisterInput(username, email, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors });
              }
            //TODO:make sure user doesn't already exist
            const user=await User.findOne({username})
              if(user){
                throw new UserInputError("username is taken",{
                    errors:{
                        username:"This username is taken"
                    }
                })
              }
            //TODO:has password and create an auth token
            password=await bcrypt.hash(password, 10)

            const newUser=new User({
                email,
                username,
                password,
                createdAt:new Date().toISOString()
            })
            const res=await newUser.save()
            const token=generateToken(res)
            return {
                ...res._doc,
                id:res._id,
                token
            }
        }
    }
}