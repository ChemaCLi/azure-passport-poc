import './App.css'
import helpers from "./helpers"
import React, { useEffect, useState } from "react"

const App = () => {
  const [state, setState] = useState({
    user: false,
    logged: false,
    loading: false,
    baseUrl: "http://localhost:4000"
  })

  const setUser = user => {
    setState(prevState => ({ ...prevState, user }))
    localStorage.setItem('user', JSON.stringify(user));
  }

  const clearUser = () => {
    localStorage.removeItem('user')
    setState(prevState => ({ ...prevState, user: false }))
  }

  const login = () => {
    window.location = `${state.baseUrl}/login/`
  }

  const logout = () => {
    window.location = `${state.baseUrl}/logout/`
    clearUser()
  }

  useEffect(() => {
    // Declare the function here to keep concerns separated
    const getUser = () => {
      helpers.getUser(`${state.baseUrl}/account`,
        user => {
          setState(prevState => ({ ...prevState, loading: false }))
          setUser(user)
        },
        error => {
          console.error(error);
          setState(prevState => ({ ...prevState, loading: false }))
        }
      )
    }

    setState(prevState => ({ ...prevState, loading: true }))

    helpers.isLogin(`${state.baseUrl}/islogin`, response => {
      setState(prevState => ({ ...prevState, logged: response }))
      if (response) {
        getUser();
      } else {
        clearUser();
        setState(prevState => ({ ...prevState, loading: false }))
      }
    }, error => {
      console.error(error);
      setState(prevState => ({ ...prevState, logged: false, loading: false }))
    })

    // add baseUrl as dependency 'cause we are using it inside the effect, and
    // it can change (because it's stored in the state)
  }, [state.baseUrl])

  return (
    <div className="App">
      <header className="App-header">
        <h1>LOGIN AZURE ACTIVE DIRECTORY EXAMPLE</h1>
      </header>
      {state.logged
        ? (
          <button
            type="button"
            onClick={logout}
            style={{fontSize: "1rem", marginBottom: "2rem", padding: "1rem 2rem"}}>
            Logout
          </button>
        ) : (
          <button
            type="button"
            onClick={login}
            style={{fontSize: "1rem", marginBottom: "2rem", padding: "1rem 2rem"}}>
            Login
          </button>
        )
      }

      {state.user && (
        <header className="App-header">
          <h1>YOU ARE LOGGED IN, CONGRATULATIONS</h1>
          <h2>User: { state.user.displayName || "No User" }</h2>
          <h2>Email: { state.user._json?.email || "No Email" }</h2>
          <h2>upn: {state.user.upn}</h2>
        </header>
      )}
    </div>
  )
};

export default App
