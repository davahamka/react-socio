const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
require("dotenv").config();

const { validateRegisterInput, validateLoginInput } = require("../utils/validator");
const User = require("../models/User");

const generateToken = (user) => {
    return jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

}

module.exports = {
  Mutation: {
      async login(_,{username,password}){
        const {errors, valid} = validateLoginInput(username,password);
        const user = await User.findOne({username});

        if(!valid){
            throw new UserInputError("Errors", {errors})
        }

        if(!user){
            errors.general = 'User not found';
            throw new UserInputError("Wrong credentials", {errors});
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            errors.general = 'User not found';
            throw new UserInputError("Wrong credentials", {errors});
        }

        const token = generateToken(user);

        return {
            ...user._doc,
            id:user._id,
            token
        }
      },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // User validation
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // Make sure that user doesnt already exit
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // Hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};