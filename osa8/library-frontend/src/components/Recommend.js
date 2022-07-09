import { ALL_BOOKS, ME } from '../queries'
import { useQuery } from '@apollo/client'

const Recommend = (props) => {
  const result = useQuery(ME)
  const me = result.data

  const variables = { genre: me ? me.me.favoriteGenre : null }
  const bookResult = useQuery(ALL_BOOKS, {
    variables: variables
  })

  if (result.loading || bookResult.loading) {
    return <div>loading...</div>
  }
  
  if (!props.show) {
    return null
  }
  
  const books = bookResult.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in your favorite genre {me.me.favoriteGenre}</p>
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
    </div>
  )
}

export default Recommend
