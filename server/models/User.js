const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schema from Book.js
const positionSchema = require("./Book");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    //syntax to create 1:N relation
    positions: [positionSchema],
  },
  // set this to use virtual below
  //virtuals are functions that can be called.
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual("positionCount").get(function () {
  return this.positions.length;
});

//we dont have to do this for position because server only needs to use User and only User needs to access position
const User = model("User", userSchema);

module.exports = User;
