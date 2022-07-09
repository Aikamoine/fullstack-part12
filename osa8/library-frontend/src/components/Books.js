import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const GenreButtons = ({books, setGenre }) => {
  const genres = [...new Set(
      [].concat.apply(
        [],
        books.map((b) => b.genres)
      )
  )]

  return (
    <div>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)
  
  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  let books = result.data.allBooks

  if (genre) {
    books = books.filter(b => b.genres.includes(genre) )
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreButtons books={books} setGenre={setGenre}></GenreButtons>
    </div>
  )
}

export default Books
