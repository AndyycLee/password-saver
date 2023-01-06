import { onAuthStateChanged } from "firebase/auth"
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

import { auth } from "../firebase"
import { db } from "../firebase_components/firebase_post"
import "../components_css/questions_display.css"

const Questions_display_list = ({ globalUserAuthorized }) => {
  const navigation: NavigateFunction = useNavigate()

  const onNextPage = (): void => {
    navigation("/")

    console.log("hello we are in the main page")
  }

  const [isRendered, setIsRendered] = useState(false)

  //Display the list of questions that is saved in the user database, needs to access the auth state
  // to see whether to render the questions or not

  let unsubscribe
  const createThing = document.getElementById("createThing")
  const thingsList = document.getElementById("thingsList")
  //ret is optional
  let ret = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Show the UI.
      if (createThing && thingsList) {
        createThing.style.display = "block"
        thingsList.style.display = "block"
      }

      createThing.onclick = async () => {
        // Add a new document to collection leetcode-users-collection with a generated id.
        const docRef = await addDoc(
          collection(db, "leetcode-users-collection"),
          {
            notes: "test1222",
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
  useEffect(() => {
    setTimeout(() => {
      setIsRendered(true)
    }, 100)
  }, [])
  // useEffect(() => {
  //   //if user is not signed in, then we should not render the questions list
  //   const user = auth.currentUser
  //   if (user) {
  //     createThing.style.display = "block"
  //   } else {
  //     createThing.style.display = "none"
  //   }
  // }, [])

  return (
    <section>
      <h2>Firestore Questions Collection</h2>
      <ul id="thingsList"></ul>
      <button
        id="createThing"
        style={{ display: isRendered ? "block" : "none" }}>
        make a leetcode question
      </button>

      {isRendered ? <div></div> : <p>Loading...</p>}

      <button onClick={onNextPage}>Home</button>
    </section>
  )
}

export default Questions_display_list
