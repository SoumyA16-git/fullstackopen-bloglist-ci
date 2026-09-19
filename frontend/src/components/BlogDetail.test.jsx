import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogDetail from './BlogDetail'

const blog = {
  id: '123',
  title: 'Testing React Hooks',
  author: 'Test Author',
  url: 'https://example.com',
  likes: 5,
  user: {
    id: 'user1',
    username: 'testuser',
    name: 'Test User'
  }
}

const currentUser = {
  id: 'user1',
  username: 'testuser',
  name: 'Test User'
}

const renderBlogDetail = (user) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={[blog]}
              user={user}
              updateBlog={vi.fn()}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('5.14 displays blog details including title, author, url, and likes', () => {
  renderBlogDetail(currentUser)

  expect(screen.getByText('Testing React Hooks')).toBeVisible()
  expect(screen.getByText('https://example.com')).toBeVisible()
  expect(screen.getByText('5')).toBeVisible()
  expect(screen.getByText(/Added by/)).toBeVisible()
  expect(screen.getByText(/Test User/)).toBeVisible()
})

test('5.14 like button can be clicked', async () => {
  const updateBlog = vi.fn()
  const deleteBlog = vi.fn()

  render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={[blog]}
              user={currentUser}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  const likeButton = screen.getByRole('button', { name: 'Like' })
  const user = userEvent.setup()

  await user.click(likeButton)

  expect(updateBlog).toHaveBeenCalledWith('123', {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: 6,
    user: 'user1'
  })
})

test('5.14 delete button visible only for blog creator', () => {
  const otherUser = {
    id: 'user2',
    username: 'otheruser',
    name: 'Other User'
  }

  const { rerender } = render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={[blog]}
              user={otherUser}
              updateBlog={vi.fn()}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  expect(
    screen.queryByRole('button', { name: 'Delete' })
  ).not.toBeInTheDocument()

  rerender(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={[blog]}
              user={currentUser}
              updateBlog={vi.fn()}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  expect(
    screen.getByRole('button', { name: 'Delete' })
  ).toBeVisible()
})

test('5.14 delete button calls deleteBlog when clicked', async () => {
  const deleteBlog = vi.fn()

  render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={[blog]}
              user={currentUser}
              updateBlog={vi.fn()}
              deleteBlog={deleteBlog}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  window.confirm = vi.fn().mockReturnValue(true)
  const deleteButton = screen.getByRole('button', { name: 'Delete' })
  const user = userEvent.setup()

  await user.click(deleteButton)

  expect(deleteBlog).toHaveBeenCalledWith('123')
})
