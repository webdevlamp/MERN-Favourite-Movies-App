import { useState } from "react"
import { useMoviesContext } from "../hooks/useMoviesContext"
import { useAuthContext } from '../hooks/useAuthContext'

const apiHost = "http://127.0.0.1:3000";

const MovieForm = () => {
  const { dispatch } = useMoviesContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [rating, setRating] = useState('')
  const [genre, setGenre] = useState('')
  const [cast, setCast] = useState('')
  const [releasedate, setReleasedate] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!user) {
      setError('You must be logged in')
      return
    }

    const movie = {name, rating, genre, cast, releasedate}

    const response = await fetch(apiHost+'/api/movies', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if(!response.ok) {

      if(json.error instanceof Array) {
        let tempEmsg = '';
        json.error.forEach(eMsg => {
          tempEmsg += eMsg.msg + '\n';
        });
        console.log(tempEmsg);
        setError(tempEmsg);
      } else {
        setError(json.error);
      }

      setEmptyFields(json.emptyFields)
    }
    if(response.ok) {
      setName('')
      setRating('')
      setGenre('')
      setCast('')
      setReleasedate('')
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_MOVIE', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Movie</h3>

      <label>Movie Name:</label>
      <input 
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>Rating ( Between 1 - 5 ):</label>
      <input 
        type="number"
        onChange={(e) => setRating(e.target.value)}
        value={rating}
      />

      <label>Genre:</label>
      <input 
        type="text"
        onChange={(e) => setGenre(e.target.value)}
        value={genre}
      />

      <label>Cast:</label>
      <input 
        type="text"
        onChange={(e) => setCast(e.target.value)}
        value={cast}
      />

      <label>Release date:</label>
      <input 
        type="date"
        onChange={(e) => setReleasedate(e.target.value)}
        value={releasedate}
      />

      <button>Add Movie</button>
      {error && <pre className="error">{error}</pre>}
    </form>
  )
}

export default MovieForm