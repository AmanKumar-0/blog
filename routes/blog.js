const express = require("express");
const blogRouter = express.Router();

const {
  getAllBlogs,
  addBlog,
  updateBlog,
  getBlog,
  deleteBlog,
  userBlog,
} = require("../controllers/blog");

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.get("/:id", getBlog);
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", userBlog);

module.exports = blogRouter;
