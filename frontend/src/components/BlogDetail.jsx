import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material'

const BlogDetail = ({ blogs, user, updateBlog, deleteBlog }) => {
  const id = useParams().id
  const navigate = useNavigate()
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <Typography variant="h6" color="error">Blog not found</Typography>
  }

  const handleLike = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: (blog.likes || 0) + 1,
      user: typeof blog.user === 'object'
        ? blog.user.id || blog.user._id
        : blog.user
    }

    await updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (confirmed) {
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  const isOwnBlog =
    blog.user &&
    typeof blog.user === 'object' &&
    user &&
    blog.user.username === user.username

  return (
    <Card sx={{ maxWidth: 600, margin: '2rem auto' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          <strong>URL:</strong> <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Likes:</strong> {blog.likes || 0}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {blog.user && typeof blog.user === 'object'
            ? `Added by ${blog.user.name}`
            : `Added by ${blog.author}`}
        </Typography>
      </CardContent>
      <CardActions>
        {user && (
          <Button size="small" variant="contained" onClick={handleLike}>
            Like
          </Button>
        )}
        {isOwnBlog && (
          <Button size="small" variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default BlogDetail
