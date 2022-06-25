const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SALT_ROUNDS, SECRET } = require("../constants");

const User = require("../models/User");

exports.register = async (information) => {
  // if (!/^[\w]+@[a-z]+\.[a-z]+$/.test(information.email)) {
  //   throw new Error("You should fill in a valid email address.");
  // }

  if (information.username.length < 5) {
    throw new Error("Your username should be at least 5 characters long.");
  }

  if (information.email.length < 10) {
    throw new Error("Your email should be at least 10 characters long.");
  }

  if (information.password.length < 4) {
    throw new Error("Your password should be at least 4 characters long.");
  }

  if (information.password !== information.rePassword) {
    throw new Error("Your passwords do not match.");
  }

  try {
    const hashedPassword = await bcrypt.hash(information.password, SALT_ROUNDS);

    const user = {
      password: hashedPassword,
      username: information.username,
      email: information.email,
    };

    const createdUser = await User.create(user);

    return (token = await tokenCreator(
      createdUser._id,
      createdUser.username,
      createdUser.email
    ));
  } catch (error) {
    throw new Error(error);
  }
};

exports.login = async (information) => {
  // if (!/^[\w]+@[a-z]+\.[a-z]+$/.test(information.email)) {
  //   throw new Error("You should fill in a valid email address.");
  // }

  if (information.email.length < 10) {
    throw new Error("Invalid username or password.");
  }

  const user = await User.findOne({ email: information.email }).lean();

  if (!user) {
    throw new Error("Invalid username or password.");
  }

  if (information.password.length < 4) {
    throw new Error("Invalid username or password.");
  }

  const isPasswordValid = await bcrypt.compare(
    information.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid username or password.");
  }

  return (token = await tokenCreator(user._id, user.username, user.email));
};

function tokenCreator(id, username, email) {
  const payload = { _id: id, username, email };

  const token = new Promise((resolve, reject) =>
    jwt.sign(payload, SECRET, { expiresIn: "1d" }, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    })
  );

  return token;
}
