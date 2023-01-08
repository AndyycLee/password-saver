import {
    GoogleAuthProvider,
    User,
    browserLocalPersistence,
    onAuthStateChanged,
    setPersistence,
    signInWithCredential
  } from "firebase/auth"
  import { useEffect, useState } from "react"
  
  import { auth } from "../firebase"
  
  import "../popup.css"
  
  import { NavigateFunction, useNavigate } from "react-router-dom"

  // import Questions_display_list from "~components/questions_display_list"
  
  // @ts-ignore
  import googleLogo from "../assets/google-login.svg"
  import BodyText from "./body_text"
  import Button from "./interesting_button"
  import ImageLink from "./leetcode_logo"
  
  setPersistence(auth, browserLocalPersistence)
  
  function IndexPopupMain( {setglobalUserAuthorized} ) {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User>(null)
  
    const onLogoutClicked = async () => {
      if (user) {
        await auth.signOut()
        setglobalUserAuthorized(null)
      }
    }
  
    const navigation: NavigateFunction = useNavigate()
  
    const onNextPage = (): void => {
      navigation("/questions_list")
        console.log("Navigated to questions list")
        console.log(user)
        if (user) {
            setglobalUserAuthorized(user)
        }
    }
  
    //is this outdated? should i use a different firebase auth ? is gooogle id services replacing firebase auth?
  
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
            //const userData =
            await signInWithCredential(auth, credential)
            console.log("Logged in with user data: ")
            //return userData
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
        setglobalUserAuthorized(user)
      })
    }, [])
    //RETURN TSX
    return (
  

        <div
          className="App"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 16
          }}>
            
          <button onClick={onNextPage} className="go-to-button cool-css">Questions List</button>
  
          <ImageLink />
  
          <BodyText />
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
          <div>
            {isLoading ? "Loading..." : ""}
            {!!user ? (
              <div className="display-details">
                Welcome to Leetcode Trainer, {user.displayName}. Your email
                address is {user.email}
              </div>
            ) : (
              ""
            )}
          </div>

                {/* <Questions_display_list globalUserAuthorized={user} /> */}
        </div>
        
  )
  }
  
  export default IndexPopupMain
  // export const { user } = IndexPopupMain