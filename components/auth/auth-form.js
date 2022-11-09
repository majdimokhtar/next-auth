import { useState, useRef } from "react"
import classes from "./auth-form.module.css"
import { signIn } from "next-auth/client"
import router, { useRouter } from "next/router"

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "something went wrong!!")
  }
  return data
}

//auth form
function AuthForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState)
  }

  async function submitHandler(event) {
    event.preventDefault()
    const entredEmail = emailInputRef.current.value
    const entredPassword = passwordInputRef.current.value

    // optional add validation
    if (isLogin) {
      // log user in

      const result = await signIn("credentials", {
        redirect: false,
        email: entredEmail,
        password: entredPassword,
      })
      if (!result.error) {
        // set some auth state
        router.replace("/profile")
      }
    } else {
      try {
        const result = await createUser(entredEmail, entredPassword)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
