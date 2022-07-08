import Todo from "./Todo";
import { render, screen } from '@testing-library/react'

const doneTodo = {
  _id: "62c66ad701ae6b38ce77e503",
  text: "write code",
  done: true
}

const notDoneTodo = {
  _id: "62c66ad701ae6b38ce77e503",
  text: "write code",
  done: false
}

const deleteTodo = jest.fn()
const completeTodo = jest.fn()

it('todo is rendered', () => {
  render(<Todo todo={doneTodo} deleteTodo={deleteTodo} completeTodo={completeTodo}></Todo>)
  const element = screen.getByText("write code")
  expect(element).toBeDefined()
})

it('todo has delete button', () => {
  render(<Todo todo={doneTodo} deleteTodo={deleteTodo} completeTodo={completeTodo}></Todo>)
  const element = screen.getByText("Delete")
  expect(element).toBeDefined()
})

it('done todo shows as done', () => {
  render(<Todo todo={doneTodo} deleteTodo={deleteTodo} completeTodo={completeTodo}></Todo>)
  const element = screen.getByText("This todo is done")
  expect(element).toBeDefined()
})

it('not done todo shows as not done', () => {
  render(<Todo todo={notDoneTodo} deleteTodo={deleteTodo} completeTodo={completeTodo}></Todo>)
  const element = screen.getByText("This todo is not done")
  expect(element).toBeDefined()
})