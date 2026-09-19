const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: 'First blog',
    author: 'Soumya',
    url: 'https://example.com',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Rahul',
    url: 'https://example.com',
    likes: 10
  },
  {
    title: 'Third blog',
    author: 'Amit',
    url: 'https://example.com',
    likes: 7
  },
  {
    title: 'Fourth blog',
    author: 'Rahul',
    url: 'https://example.com',
    likes: 3
  }
]

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

test('total likes', () => {
  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 25)
})

test('favorite blog', () => {
  const result = listHelper.favoriteBlog(blogs)
  assert.deepStrictEqual(result, blogs[1])
})

test('most blogs', () => {
  const result = listHelper.mostBlogs(blogs)
  assert.deepStrictEqual(result, {
    author: 'Rahul',
    blogs: 2
  })
})

test('most likes', () => {
  const result = listHelper.mostLikes(blogs)
  assert.deepStrictEqual(result, {
    author: 'Rahul',
    likes: 13
  })
})