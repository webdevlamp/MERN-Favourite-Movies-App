import { useEffect }from 'react'
import { useMoviesContext } from "../hooks/useMoviesContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import MovieDetails from '../components/MovieDetails'
import MovieForm from '../components/MovieForm'

const Home = () => {
  const {movies, dispatch} = useMoviesContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch('/api/movies', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if(response.ok) {
        dispatch({type: 'SET_MOVIES', payload: json})
      }
    }

    if(user) {
      fetchMovies()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="movies">
        {movies && movies.map((movie) => (
          <MovieDetails key={movie.id} movie={movie} />
        ))}
      </div>
      <MovieForm />
    </div>
  )
}

export default Home