import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'
import { useState } from 'react'
import Select from 'react-select'

const BirthForm = ({ authors }) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
  })

  const authorOptions = authors.map(a => ({value: a.name, label: a.name}))
  
  const submit = (event) => {
    event.preventDefault()
    const chosenName = name.value
    const bornNumber = Number(born)

    updateAuthor({ variables: { name: chosenName, setBornTo: bornNumber}})
    setName('')
    setBorn('')
  }
  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          <Select defaultValue={name} onChange={setName} options={ authorOptions } />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  if (result.loading) {
    return <div>loading...</div>
  }
  
  const authors = result.data.allAuthors
  
  if (!props.show) {
    return null
  }
  
  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthForm authors = {authors}></BirthForm>
    </div>
  )
}

export default Authors
