const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let user
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()

  token = jwt.sign(
    {
      username: user.username,
      id: user._id
    },
    process.env.SECRET,
    {
      expiresIn: 60 * 60
    }
  )

  const blogs = helper.initialBlogs.map(blog => ({
    ...blog,
    user: user._id
  }))

  const savedBlogs = await Blog.insertMany(blogs)

  user.blogs = savedBlogs.map(blog => blog._id)
  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    helper.initialBlogs.length
  )
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a new blog can be added with a valid token', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Soumya',
    url: 'https://example.com/new',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    helper.initialBlogs.length + 1
  )

  const titles = response.body.map(blog => blog.title)

  assert(titles.includes('New Blog'))
})

test('creating a blog without token returns 401', async () => {
  const newBlog = {
    title: 'No Token Blog',
    author: 'Soumya',
    url: 'https://example.com/no-token',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('likes defaults to 0 if missing', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Soumya',
    url: 'https://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('likes can be explicitly set to 0', async () => {
  const newBlog = {
    title: 'Blog with zero likes',
    author: 'Soumya',
    url: 'https://example.com/zero',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Soumya',
    url: 'https://example.com/no-title',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL',
    author: 'Soumya',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await Blog.find({})

  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(
    blogsAtEnd.length,
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(blog => blog.title)

  assert(!titles.includes(blogToDelete.title))
})

test('a blog cannot be deleted by another user', async () => {
  const passwordHash = await bcrypt.hash('anotherpassword', 10)

  const anotherUser = await User.create({
    username: 'another',
    name: 'Another User',
    passwordHash
  })

  const blog = await Blog.findOne({})

  const anotherToken = jwt.sign(
    {
      username: anotherUser.username,
      id: anotherUser._id
    },
    process.env.SECRET,
    {
      expiresIn: 60 * 60
    }
  )

  await api
    .delete(`/api/blogs/${blog.id}`)
    .set('Authorization', `Bearer ${anotherToken}`)
    .expect(401)

  const blogStillExists = await Blog.findById(blog.id)

  assert.ok(blogStillExists)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})

  const updated = blogsAtEnd.find(
    blog => blog.id === blogToUpdate.id
  )

  assert.strictEqual(
    updated.likes,
    blogToUpdate.likes + 10
  )
})

test('a newly created blog contains creator information', async () => {
  const newBlog = {
    title: 'Blog with creator',
    author: 'Soumya',
    url: 'https://example.com/creator',
    likes: 5
  }

  const created = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  const blog = response.body.find(
    blog => blog.id === created.body.id
  )

  assert.ok(blog.user)
  assert.strictEqual(blog.user.username, 'root')
  assert.strictEqual(blog.user.name, 'Superuser')
})

test('creating a blog assigns it to the logged-in user', async () => {
  const newBlog = {
    title: 'Blog with user',
    author: 'Soumya',
    url: 'https://example.com/user-blog',
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(
    response.body.user.toString(),
    user._id.toString()
  )

  const updatedUser = await User.findById(user._id)

  assert.strictEqual(updatedUser.blogs.length, 4)
})

after(async () => {
  await mongoose.connection.close()
})