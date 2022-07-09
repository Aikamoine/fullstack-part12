import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  console.log('todos in List', todos)

  return (
    <>
      {todos.map(todo => {
        return (
          <Todo key={todo._id} todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
        )
      }).reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </>
  )
}

export default TodoList
