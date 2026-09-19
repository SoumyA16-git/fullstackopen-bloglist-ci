import { Link } from 'react-router-dom'
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material'

const Blog = ({ blog }) => {
  return (
    <Card sx={{ marginBottom: 2 }} className="blog">
      <CardContent>
        <Typography variant="h6">
          {blog.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          by {blog.author}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/blogs/${blog.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  )
}

export default Blog
