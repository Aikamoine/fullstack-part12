const Todo = ({ key, todo, deleteTodo, completeTodo }) => {
  console.log('todo', todo)
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  const doneInfo = (
    <>
      <span key={"doneText"}>This todo is done</span>
      <span key={"doneButtons"}>
        <button onClick={onClickDelete(todo)}> Delete </button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span key={"notDoneText"}>
        This todo is not done
      </span>
      <span key={"notDoneButtons"}>
        <button onClick={onClickDelete(todo)}> Delete </button>
        <button onClick={onClickComplete(todo)}> Set as done </button>
      </span>
    </>
  )

  return (
    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span key={todo.text}>
        {todo.text} 
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}

export default Todo