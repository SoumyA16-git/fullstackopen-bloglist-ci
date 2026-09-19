const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
})

test('a user can be created', async () => {
  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(usersAtEnd.length, 1)
  assert.strictEqual(usersAtEnd[0].username, newUser.username)
  assert.strictEqual(usersAtEnd[0].name, newUser.name)
  assert.strictEqual(usersAtEnd[0].passwordHash, undefined)
})

test('users can be fetched', async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)

  await User.create({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].username, 'root')
})

test('user creation fails if username is missing', async () => {
  const newUser = {
    name: 'Missing Username',
    password: 'salainen'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(response.body.error)
})

test('user creation fails if password is missing', async () => {
  const newUser = {
    username: 'missingpassword',
    name: 'Missing Password'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(response.body.error)
})

test('user creation fails if username is less than 3 characters', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'salainen'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(response.body.error.includes('username'))
})

test('user creation fails if password is less than 3 characters', async () => {
  const newUser = {
    username: 'validusername',
    name: 'Short Password',
    password: 'ab'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(response.body.error.includes('password'))
})

test('user creation fails if username is already taken', async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)

  await User.create({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  const newUser = {
    username: 'root',
    name: 'Another User',
    password: 'salainen'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(
    response.body.error.includes('username')
  )
})

test('users contain their blogs', async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = await User.create({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  const blog = await Blog.create({
    title: 'User Blog',
    author: 'Soumya',
    url: 'https://example.com/user-blog',
    likes: 5,
    user: user._id
  })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const response = await api
    .get('/api/users')
    .expect(200)

  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].blogs.length, 1)
  assert.strictEqual(
    response.body[0].blogs[0].title,
    'User Blog'
  )
})

test('a user can login with correct credentials', async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)

  await User.create({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(response.body.token)
  assert.strictEqual(response.body.username, 'root')
  assert.strictEqual(response.body.name, 'Superuser')
})

test('login fails with wrong password', async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)

  await User.create({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'wrongpassword'
    })
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})