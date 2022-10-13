import { useMoviesContext } from '../hooks/useMoviesContext';
import { useAuthContext } from '../hooks/useAuthContext';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const apiHost = "http://127.0.0.1:3000";

const MovieDetails = ({ movie }) => {
  const { dispatch } = useMoviesContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if(!user) {
      return
    }

    const response = await fetch(apiHost+'/api/movies/' + movie.id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if(response.ok) {
      dispatch({type: 'DELETE_MOVIE', payload: json})
    }
  }

  return (
    <div className="movie-details">
      <table className="movie-table">
        <thead>
          <tr>
            <th><h4>{movie.name}</h4></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Rating ( Between 1 - 5 )</th>
            <td>{movie.rating}</td>
          </tr>
          <tr>
            <th>Genre</th>
            <td>{movie.genre}</td>
          </tr>
          <tr>
            <th>Cast</th>
            <td>{movie.cast}</td>
          </tr>
          <tr>
            <th>Release date</th>
            <td>{formatDistanceToNow(new Date(movie.releasedate), { addSuffix: true })}</td>
          </tr>
        </tbody>
      </table>
      <span className="material-symbols-outlined" onClick={handleClick} title="Delete">delete</span>
    </div>
  )
}

export default MovieDetails