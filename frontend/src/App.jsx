import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Box } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogDetail from './components/BlogDetail'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const getBlogs = async () => {
      const initialBlogs = await blogService.getAll()

      const sortedBlogs = initialBlogs.sort(
        (a, b) => (b.likes || 0) - (a.likes || 0)
      )

      setBlogs(sortedBlogs)
    }

    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showNotification = message => {
    setNotification(message)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)

      setUser(loggedUser)
      setUsername('')
      setPassword('')

      showNotification('login successful')

      navigate('/')
    } catch {
      showNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')

    blogService.setToken(null)

    setUser(null)
    setUsername('')
    setPassword('')

    showNotification('logged out')

    navigate('/')
  }

  const handleCreateBlog = async newBlog => {
    try {
      await blogService.create(newBlog)

      const updatedBlogs = await blogService.getAll()

      const sortedBlogs = updatedBlogs.sort(
        (a, b) => (b.likes || 0) - (a.likes || 0)
      )

      setBlogs(sortedBlogs)

      showNotification(
        `a new blog "${newBlog.title}" by ${newBlog.author} added`
      )

      navigate('/')

      return true
    } catch {
      showNotification('creating blog failed')
      return false
    }
  }

  const handleUpdateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(
        id,
        updatedBlog
      )

      setBlogs(currentBlogs => {
        const updatedBlogs = currentBlogs.map(blog =>
          blog.id === id ? returnedBlog : blog
        )

        return [...updatedBlogs].sort(
          (a, b) => (b.likes || 0) - (a.likes || 0)
        )
      })

      showNotification('blog liked')

      return returnedBlog
    } catch {
      showNotification('updating blog failed')
    }
  }

  const handleDeleteBlog = async id => {
    try {
      await blogService.remove(id)

      setBlogs(currentBlogs =>
        currentBlogs.filter(blog => blog.id !== id)
      )

      showNotification('blog deleted')

      navigate('/')
    } catch {
      showNotification('deleting blog failed')
    }
  }

  const Blogs = () => (
    <div>
      <h2>blogs</h2>

      {user && (
        <p>
          {user.name} logged in
        </p>
      )}

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )

  const CreateBlog = () => {
    if (!user) {
      return (
        <div>
          <p>login required</p>
        </div>
      )
    }

    return (
      <div>
        <h2>create new</h2>

        <BlogForm
          createBlog={handleCreateBlog}
        />
      </div>
    )
  }

  const Login = () => (
    <LoginForm
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  )

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Blogs
            </Button>
          </Box>

          {!user && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}

          {user && (
            <>
              <Box sx={{ marginRight: 2 }}>
                <span style={{ color: 'white', marginRight: '1rem' }}>
                  {user.name} logged in
                </span>
              </Box>
              <Button color="inherit" component={Link} to="/create">
                Create new
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notification message={notification} />

      <Container sx={{ marginTop: 3 }}>
        <Routes>
          <Route
            path="/"
            element={<Blogs />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/blogs/:id"
            element={
              <BlogDetail
                blogs={blogs}
                user={user}
              updateBlog={handleUpdateBlog}
              deleteBlog={handleDeleteBlog}
            />
          }
        />

        <Route
          path="/create"
          element={<CreateBlog />}
        />
      </Routes>
      </Container>
    </>
  )
}

export default App