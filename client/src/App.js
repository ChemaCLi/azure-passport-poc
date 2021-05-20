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
    console.log("setUser", user)
    setState({ ...state, user })
    localStorage.setItem('user', JSON.stringify(user));
  }

  const clearUser = () => {
    localStorage.removeItem('user')
    setState({ ...state, user: false })
  }

  const login = () => {
    window.location = `${state.baseUrl}/login/`
  }

  const logout = () => {
    window.location = `${state.baseUrl}/logout/`
    clearUser()
  }

  const getUser = () => {
    helpers.getUser(`${state.baseUrl}/account`,
      user => {
        console.log(user)
        setUser(user)
        setState({ ...state, loading: false })
      },
      error => {
        console.error(error);
        setState({ ...state, loading: false })
      }
    )
  }

  useEffect(() => {
    setState({ ...state, loading: true })
    helpers.isLogin(`${state.baseUrl}/islogin`, response => {
      console.log("RESPONSE", response)
      setState({ ...state, logged: response })
      if (response) {
        getUser();
      } else {
        clearUser();
        setState({ ...state, loading: false })
      }
    }, error => {
      console.error(error);
      setState({ ...state, logged: false, loading: false })
      console.log("We are under the error function. Logged will be false")
    })
  }, [])

  console.log("STATE", state)
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
          <h1>YOU ARE LOGIN CONGRATULATIONS</h1>
          <h2>User: { state.user?.displayName || "No User" }</h2>
          <h2>Email: { state.user?._json?.email || "No Email" }</h2>
        </header>
      )}
    </div>
  )
};

export default App
