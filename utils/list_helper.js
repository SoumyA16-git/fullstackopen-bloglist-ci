const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0

  blogs.forEach(blog => {
    total += blog.likes
  })

  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favorite = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}

  blogs.forEach(blog => {
    if (counts[blog.author]) {
      counts[blog.author] += 1
    } else {
      counts[blog.author] = 1
    }
  })

  let author = Object.keys(counts)[0]

  Object.keys(counts).forEach(name => {
    if (counts[name] > counts[author]) {
      author = name
    }
  })

  return {
    author: author,
    blogs: counts[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likes = {}

  blogs.forEach(blog => {
    if (likes[blog.author]) {
      likes[blog.author] += blog.likes
    } else {
      likes[blog.author] = blog.likes
    }
  })

  let author = Object.keys(likes)[0]

  Object.keys(likes).forEach(name => {
    if (likes[name] > likes[author]) {
      author = name
    }
  })

  return {
    author: author,
    likes: likes[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}