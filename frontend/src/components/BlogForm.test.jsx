import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('5.12 form calls createBlog with correct details', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.click(
    screen.getByText('create new blog')
  )

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'My Test Blog')
  await user.type(inputs[1], 'Soumya')
  await user.type(inputs[2], 'https://example.com')

  await user.click(screen.getByRole('button', { name: 'Create' }))

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'My Test Blog',
    author: 'Soumya',
    url: 'https://example.com'
  })
})