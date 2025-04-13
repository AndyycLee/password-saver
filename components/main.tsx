import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithCredential,
  signInWithPopup
} from "firebase/auth"
import React from "react"
import { useEffect, useState } from "react"

// import { getCurrentTab } from "../background"
import { auth } from "../firebase"

import "../popup.css"

import { NavigateFunction, useNavigate } from "react-router-dom"

// import Questions_display_list from "~components/questions_display_list"
// @ts-ignore
import github_img from "../assets/github-mark.png"
// @ts-ignore
import googleLogo from "../assets/google-login.svg"
// @ts-ignore
import kofi_img from "../assets/kofi_logo.webp"
import BodyText from "./body_text"
import CreateThing from "./createThing"
import Button from "./interesting_button"
import ImageLink from "./leetcode_logo"

// import Content_leetcode from "./url_leetcode"

setPersistence(auth, browserLocalPersistence)

function IndexPopupMain({ setglobalUserAuthorized }) {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User>(null)
  // const [userAccessToken, setUserAccessToken] = useState<string>(null);

  const onLogoutClicked = async () => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        // Step 1: Remove cached token from Chrome
        chrome.identity.removeCachedAuthToken({ token }, () => {
          console.log("Cached token removed from Chrome")

          // Step 2: Sign out from Firebase
          auth.signOut().then(() => {
            console.log("User signed out from Firebase")
          })
        })

        chrome.identity.clearAllCachedAuthTokens(() =>
          console.log("Cleared cached auth tokens")
        )

        // Step 3: Revoke token globally from Google
        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
          .then(() => {
            console.log("Google token revoked")
          })
          .catch((error) => console.error("Error revoking token:", error))
      } else {
        console.log("No token found to revoke")
      }
    })
  }

  // found thru plasmo docs
  const navigation: NavigateFunction = useNavigate()

  const onNextPage = (): void => {
    navigation("/questions_list")
    console.log("Navigated to questions list")
    console.log(user)
    if (user) {
      //is this even doing anything?? yes it is
      console.log("uhello is this doing anything?")
      setglobalUserAuthorized(user)
    }
  }

  //is this outdated? should i use a different firebase auth ? is gooogle id services replacing firebase auth? no

  // When the user clicks log in, we need to ask Chrome
  // to log them in, get their Google auth token,
  // send it to Firebase, and let Firebase do its magic
  // if everything worked, we'll get a user object from them
  const onLoginClicked = () => {
    chrome.identity.clearAllCachedAuthTokens(() => {
      chrome.identity.getAuthToken(
        { interactive: true },
        async function (token) {
          if (chrome.runtime.lastError || !token) {
            console.error(chrome.runtime.lastError)
            setIsLoading(false)
            return
          }
          if (token) {
            const credential = GoogleAuthProvider.credential(null, token)
            try {
              const userCredential = await signInWithCredential(
                auth,
                credential
              )
              console.log("Logged in with user data")
              console.log("User Access token:", credential.accessToken)
            } catch (e) {
              console.error("Could not log in. ", e)
            }
          }
        }
      )
    })
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(false)
      setUser(user)
      setglobalUserAuthorized(user)
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
      <button onClick={onNextPage} className="go-to-button cool-css">
        Passwords List
      </button>

      <ImageLink />

      <BodyText user={user} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        {!user ? (
          <Button
            secondary
            onClick={() => {
              setIsLoading(true)
              onLoginClicked()
            }}>
            <img src={googleLogo} alt="google-logo" className="google-img" />
            Google Log in
          </Button>
        ) : (
          <Button
            secondary
            onClick={() => {
              setIsLoading(true)
              onLogoutClicked()
            }}>
            <img src={googleLogo} alt="google-logo" className="google-img" />
            Log out
          </Button>
        )}
      </div>

      <div>{isLoading ? "Loading..." : ""}</div>
      <div>
        {" "}

        <CreateThing isRendered={true} user={user} page={"page1"}></CreateThing>
      </div>

      <div className="justify-content-space">
        <a href="https://github.com/AndyycLee/password-saver" target="_blank">
          <img height="26" src={github_img} alt="Github link" id="github-img" />
        </a>
        <a href="https://ko-fi.com/G2G2HI148" target="_blank">
          <img height="36" src={kofi_img} alt="Buy Me a Coffee at ko-fi.com" />
        </a>
      </div>
      {/* <Questions_display_list globalUserAuthorized={user} /> */}
    </div>
  )
}

export default IndexPopupMain
// export const { user } = IndexPopupMain
