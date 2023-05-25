// Resolver from 24-StuDecode-JWT
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user); // Logging the value of the 'user' property from the context object
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).populate('savedBooks'); // Retrieving user data from the database
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!'); 
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password }); // Creating a new user in the database
      const token = signToken(user); // Generating a JWT token for the user
      return { token, user }; // Returning the generated token and the user object
    },
    login: async (parent, { email, password }) => {
      // Look up the user by the provided email address. Since the `email` field is unique
      const user = await User.findOne({ email });
      // If there is no user with that email address, return an Authentication err
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      // If there is a user found, execute the `isCorrectPassword`
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },

    saveBook: async (parent, { bookInput }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true, runValidators: true }
        ).populate("savedBooks"); // Updating the user's savedBooks array with the new book and retrieving the updated user data
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate("savedBooks"); // Removing the specified book from the user's savedBooks array and retrieving the updated user data
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;