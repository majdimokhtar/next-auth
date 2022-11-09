import classes from "./profile-form.module.css"
import { useRef } from "react"

function ProfileForm({ onCHangePassword }) {
  const oldPasswordRef = useRef()
  const newPasswordRef = useRef()
  function submitHandler(e) {
    e.preventDefault()
    const entredOldPassword = oldPasswordRef.current.value
    const entredNewPassword = newPasswordRef.current.value

    onCHangePassword({
      oldPassword: entredOldPassword,
      newPassword: entredNewPassword,
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
