import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

test('5.16 Togglable renders children initially hidden', () => {
  render(
    <Togglable buttonLabel="show">
      <div>hidden text</div>
    </Togglable>
  )

  expect(screen.queryByText('hidden text')).not.toBeVisible()
})

test('5.16 Togglable shows children when button is clicked', async () => {
  render(
    <Togglable buttonLabel="show">
      <div>hidden text</div>
    </Togglable>
  )

  const toggleButton = screen.getByRole('button', { name: 'show' })
  const user = userEvent.setup()

  await user.click(toggleButton)

  expect(screen.getByText('hidden text')).toBeVisible()
})

test('5.16 Togglable hides children when cancel button is clicked', async () => {
  render(
    <Togglable buttonLabel="show">
      <div>hidden text</div>
    </Togglable>
  )

  const toggleButton = screen.getByRole('button', { name: 'show' })
  const user = userEvent.setup()

  await user.click(toggleButton)

  const cancelButton = screen.getByRole('button', { name: 'Cancel' })
  await user.click(cancelButton)

  expect(screen.queryByText('hidden text')).not.toBeVisible()
})

test('5.16 Togglable initially shows toggle button', () => {
  render(
    <Togglable buttonLabel="open">
      <div>content</div>
    </Togglable>
  )

  expect(
    screen.getByRole('button', { name: 'open' })
  ).toBeVisible()
})
