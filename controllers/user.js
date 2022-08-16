// import bcrypt from "bcryptjs";
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getAllUser = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }
  if (!users) {
    return res.status(404).json({ message: "NO user found" });
  }
  return res.status(200).json({ users });
};

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }
  if (existingUser) {
    return res.status(400).json({ message: "User exists" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }
  return res.status(201).json({ user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "USer not found" });
  }

  const isPassword = bcrypt.compareSync(password, existingUser.password);
  if (!isPassword) {
    return res.status(404).json({ message: "Password Incorrect" });
  }
  return res
    .status(200)
    .json({ message: "Login successfull", user: existingUser });
};
