const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    /*parent: represents  our application,
        args: args passed into this query,
        context: is basically our auth middleware */
    user: async (parent, args, context) => {
      //context is a session storage.
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id,
        })
          //we are telling mongoDB to exclude version(__v), and password
          .select("-__v -password");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (parent, { username, password }) => {
      const user = await User.findOne({
        username,
      });
      if (!user) {
        throw new AuthenticationError("Invalid user");
      }
      //user.isCorrectPassword is in models/User.js  returns boolean
      const validHashedPW = await user.isCorrectPassword(password);
      if (!validHashedPW) {
        throw new AuthenticationError("Invalid password");
      }
      //use signToken in
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    savePosition: async (parent, { ...position }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          //push into positions data
          { $push: { positions: position } },
          //returns updated or "new" object
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Must be logged in");
    },
    removePosition: async (parent, { positionId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          //remove position data from positions
          { $pull: { positions: { positionId } } },
          //returns updated or "new" object
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Must be logged in");
    },
  },
};

module.exports = resolvers;
