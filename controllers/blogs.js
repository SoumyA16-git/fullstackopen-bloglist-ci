const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    try {
      const savedBlog = await blog.save()

      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      const populatedBlog = await savedBlog.populate(
        'user',
        { username: 1, name: 1 }
      )

      response.status(201).json(populatedBlog)
    } catch (error) {
      response.status(400).json({
        error: error.message
      })
    }
  }
)

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    const user = request.user

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({
        error: 'only the creator can delete the blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter