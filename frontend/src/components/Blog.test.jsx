import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogDetail from './BlogDetail'

const blog = {
  id: '123',
  title: 'Testing React Router',
  author: 'Test Author',
  url: 'https://example.com',
  likes: 5,
  user: {
    id: 'user1',
    username: 'testuser',
    name: 'Test User'
  }
}

const renderBlogDetail = user => {
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

test('renders title and author with a link to the blog', () => {
  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  expect(
    screen.getByText('Testing React Router')
  ).toBeDefined()

  expect(screen.getByText('by Test Author')).toBeDefined()

  expect(
    screen.getByRole('link')
  ).toHaveAttribute('href', '/blogs/123')
})

test('unauthenticated user sees blog information but no buttons', () => {
  renderBlogDetail(null)

  expect(
    screen.getByText('Testing React Router')
  ).toBeDefined()

  expect(
    screen.getByText('https://example.com')
  ).toBeDefined()

  expect(
    screen.getByText('5')
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: 'Like' })
  ).toBeNull()

  expect(
    screen.queryByRole('button', { name: 'Delete' })
  ).toBeNull()
})

test('logged in non-creator sees like button but not remove button', async () => {
  const loggedInUser = {
    username: 'anotheruser',
    name: 'Another User',
    token: 'token'
  }

  const updateBlog = vi.fn()

  render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blogs={[blog]}
              user={loggedInUser}
              updateBlog={updateBlog}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  const likeButton = screen.getByRole('button', {
    name: 'Like'
  })

  expect(likeButton).toBeDefined()

  expect(
    screen.queryByRole('button', { name: 'Delete' })
  ).toBeNull()

  await userEvent.click(likeButton)

  expect(updateBlog).toHaveBeenCalledTimes(1)
})

test('creator sees remove button', () => {
  const loggedInUser = {
    username: 'testuser',
    name: 'Test User',
    token: 'token'
  }

  renderBlogDetail(loggedInUser)

  expect(
    screen.getByRole('button', { name: 'Like' })
  ).toBeDefined()

  expect(
    screen.getByRole('button', { name: 'Delete' })
  ).toBeDefined()
})