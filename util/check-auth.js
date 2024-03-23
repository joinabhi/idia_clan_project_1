const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');



module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  console.log("10", authHeader)
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    console.log("11234567890", token)
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        console.log("123___", user)
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error('Authorization header must be provided');
};