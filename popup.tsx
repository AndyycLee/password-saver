import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithCredential
} from "firebase/auth"
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,

} from "firebase/firestore"
import { useEffect, useState } from "react"

import { auth } from "./firebase"
import { db } from "./firebase_components/firebase_post"

import "./popup.css"

// @ts-ignore
import googleLogo from "./assets/google-login.svg"
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
    })
  }, [])

  let unsubscribe
const createThing = document.getElementById("createThing")
const thingsList = document.getElementById("thingsList")

let ret = onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Show the UI.
    createThing.style.display = "block"
    thingsList.style.display = "block"

    createThing.onclick = async () => {
      // Add a new document to collection leetcode-users-collection with a generated id.
      const docRef = await addDoc(
        collection(db, "leetcode-users-collection"),
        {
          notes: "new 3333 test hehehehe",
          timestamp: serverTimestamp(),
          uid: user.uid,
          link: "https://leetcode.com/problems/diameter-of-binary-tree/"
        }
      )
      console.log("Document written with ID: ", docRef.id)
    }
    const q = query(
      collection(db, "leetcode-users-collection"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    )

    unsubscribe = onSnapshot(q, (querySnapshot) => {
      let items = ""
      querySnapshot.forEach((doc) => {
        items += `<li>${doc.data().notes}</li>`
      })
      thingsList.innerHTML = items
    })
  } else {
    // Hide the UI.
    createThing.style.display = "none"
    thingsList.style.display = "none"

    unsubscribe && unsubscribe()
    console.log("No user is signed in.")
  }
})


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
            Welcome to Leetcode Trainer, {user.displayName}. Your email address
            is {user.email}
          </div>
        ) : (
          ""
        )}
      </div>

      <section>
        <h2>My Firestore Collection</h2>
        <ul id="thingsList"></ul>
        <button id="createThing" style={{display:"none" }}>Will make a leetcode question</button>
      </section>
    </div>
  )
}

export default IndexPopup
