const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Soumya',
    url: 'https://example.com/html',
    likes: 5
  },
  {
    title: 'CSS is fun',
    author: 'Rahul',
    url: 'https://example.com/css',
    likes: 3
  },
  {
    title: 'JavaScript is powerful',
    author: 'Amit',
    url: 'https://example.com/javascript',
    likes: 8
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  usersInDb,
  blogsInDb
}