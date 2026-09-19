import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

test('5.15 login form renders with username and password fields', () => {
  const mockHandleLogin = vi.fn()

  render(
    <LoginForm
      username=""
      password=""
      setUsername={vi.fn()}
      setPassword={vi.fn()}
      handleLogin={mockHandleLogin}
    />
  )

  expect(screen.getByText('Log in to application')).toBeVisible()
  expect(screen.getByLabelText('username:')).toBeVisible()
  expect(screen.getByLabelText('password:')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Login' })).toBeVisible()
})

test('5.15 login form calls setUsername and setPassword on input change', async () => {
  const setUsername = vi.fn()
  const setPassword = vi.fn()

  render(
    <LoginForm
      username=""
      password=""
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={vi.fn()}
    />
  )

  const usernameInput = screen.getByLabelText('username:')
  const passwordInput = screen.getByLabelText('password:')

  const user = userEvent.setup()

  await user.type(usernameInput, 'testuser')
  await user.type(passwordInput, 'testpass')

  expect(setUsername).toHaveBeenCalled()
  expect(setPassword).toHaveBeenCalled()
})

test('5.15 login form calls handleLogin on submit', async () => {
  const handleLogin = vi.fn()
  const setUsername = vi.fn()
  const setPassword = vi.fn()

  render(
    <LoginForm
      username="testuser"
      password="testpass"
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  )

  const loginButton = screen.getByRole('button', { name: 'Login' })
  const user = userEvent.setup()

  await user.click(loginButton)

  expect(handleLogin).toHaveBeenCalled()
})

test('5.15 login form displays correct input values', () => {
  render(
    <LoginForm
      username="myusername"
      password="mypassword"
      setUsername={vi.fn()}
      setPassword={vi.fn()}
      handleLogin={vi.fn()}
    />
  )

  const usernameInput = screen.getByLabelText('username:')
  const passwordInput = screen.getByLabelText('password:')

  expect(usernameInput).toHaveValue('myusername')
  expect(passwordInput).toHaveValue('mypassword')
})
