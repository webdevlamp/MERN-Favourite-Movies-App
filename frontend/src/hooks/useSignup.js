import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

const apiHost = "http://127.0.0.1:3000";

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (name, email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(apiHost+'/api/users/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password })
    })
    const json = await response.json()

    if(!response.ok) {
      setIsLoading(false)

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

    }
    if(response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}