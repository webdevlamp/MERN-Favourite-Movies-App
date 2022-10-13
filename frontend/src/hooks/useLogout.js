import { useAuthContext } from './useAuthContext'
import { useMoviesContext } from './useMoviesContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchMovies } = useMoviesContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    dispatchMovies({ type: 'SET_MOVIES', payload: null })
  }

  return { logout }
}