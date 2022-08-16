const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");

exports.getAllBlogs = async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (error) {
    return console.log(error);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No blog find " });
  }
  return res.status(200).json({ blogs });
};

exports.addBlog = async (req, res) => {
  const { title, description, image, user } = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(user);
  } catch (error) {
    console.log(error);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "unable to find user by this Id" });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    // await blog.save();
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ blog });
};

exports.updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, description } = req.body;
  let blog;

  try {
    blog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unable to update" });
  }
  return res.status(200).json({ blog });
};

exports.getBlog = async (req, res) => {
  const blogId = req.params.id;

  let blog;

  try {
    blog = await Blog.findById(blogId);
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(404).json({ message: "Unable to find Post" });
  }

  return res.status(200).json({ blog });
};

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndDelete(blogId).populate("user");
    await blog.user.bloges.pull(blog);
    // console.log(blogId);
    await blog.user.save();
  } catch (error) {
    console.log(error);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Deleted" });
};

exports.userBlog = async (req, res) => {
  const userId = req.params.id;
  let userBlogs;

  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    return console.log(error);
  }

  if (!userBlogs) {
    return res.status(404).json({ message: "No Blg found" });
  }

  return res.status(200).json({ user: userBlogs });
};
