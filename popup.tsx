import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithCredential
} from "firebase/auth"
import { useEffect, useState } from "react"

import { auth } from "./firebase"

import "./popup.css"

import BodyText from "./components/body_text"
import Button from "./components/interesting_button"
import ImageLink from "./components/leetcode_logo"

setPersistence(auth, browserLocalPersistence)

function IndexPopup() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User>(null)

  const onLogoutClicked = async () => {
    if (user) {
      await auth.signOut()
    }
  }

  // When the user clicks log in, we need to ask Chrome
  // to log them in, get their Google auth token,
  // send it to Firebase, and let Firebase do its magic
  // if everything worked, we'll get a user object from them
  const onLoginClicked = () => {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      if (chrome.runtime.lastError || !token) {
        console.error(chrome.runtime.lastError)
        setIsLoading(false)
        return
      }
      if (token) {
        const credential = GoogleAuthProvider.credential(null, token)
        try {
          await signInWithCredential(auth, credential)
        } catch (e) {
          console.error("Could not log in. ", e)
        }
      }
    })
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(false)
      setUser(user)
    })
  }, [])

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <ImageLink />

      <BodyText />
      {!user ? (
        <Button
          secondary
          onClick={() => {
            setIsLoading(true)
            onLoginClicked()
          }}>
          Google Log in
        </Button>
      ) : (
        <Button
          secondary
          onClick={() => {
            setIsLoading(true)
            onLogoutClicked()
          }}>
          Log out
        </Button>
      )}
      <div>
        {isLoading ? "Loading..." : ""}
        {!!user ? (
          <div className="display-details">
            Welcome to Leetcode Trainer, {user.displayName}. Your email address
            is {user.email}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}

export default IndexPopup
