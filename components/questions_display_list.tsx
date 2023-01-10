import { AuthErrorCodes, onAuthStateChanged } from "firebase/auth"
import { getAuth } from "firebase/auth"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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

import type { User } from "firebase/auth"

// import Button from "./interesting_button"

import CreateThing from "./createThing"

const Questions_display_list = ({ globalUserAuthorized }) => {
  const [testUser, setTestUser] = useState<User>(null)

  const navigation: NavigateFunction = useNavigate()

  const onNextPage = (): void => {
    navigation("/")

    console.log("hello we are in the main page")
  }

  const handleDocumentDelete = async (e, timestamp: any) => {
    e.preventDefault()
    //i named it timestamp, but in reality it is the id of the document
    const docRef = doc(db, "leetcode-users-collection", timestamp)
    await deleteDoc(docRef).catch((error) => {
      console.error("Error removing document: ", error)
    })

    console.log("Document successfully deleted!", timestamp)
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
      if (thingsList) {
        createThing.style.display = "block"
        thingsList.style.display = "block"
      }

      // createThing.onclick = async () => {
      //   // Add a new document to collection leetcode-users-collection with a generated id.
      //   const docRef = await addDoc(
      //     collection(db, "leetcode-users-collection"),
      //     {
      //       notes: `random num: ${Math.random()}`,
      //       timestamp: serverTimestamp(),
      //       uid: user.uid,
      //       link: "https://leetcode.com/problems/diameter-of-binary-tree/"
      //     }
      //   )
      //   console.log("Document written with ID: ", docRef.id)
      //   // console.log(serverTimestamp())
      // }
      const q = query(
        collection(db, "leetcode-users-collection"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      )
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        thingsList.innerHTML = "" // clear the thingsList element
        querySnapshot.forEach((doc) => {
          // create list item element
          const listItem = document.createElement("li")
          listItem.textContent = doc.data().notes

          // create delete button element
          const deleteButton = document.createElement("button")
          deleteButton.className = "deleter-collection cool-css"
          deleteButton.textContent = "\u00D7"
          deleteButton.onclick = function (e) {
            handleDocumentDelete(e, doc.id)
          }

          // append delete button to list item
          listItem.appendChild(deleteButton)

          // append list item to thingsList element - is this inefficient? or does firebase batch updates?
          thingsList.appendChild(listItem)
          console.log("hello onSnapshot", listItem)
        })

        // let items = ""
        // querySnapshot.forEach((doc) => {
        //   //I want to add a button to delete the question from the list on each question -  docRef.id
        //   items += `<li>${
        //     doc.data().notes
        //   }</li> <button class="deleter-collection" onclick={ (e) =>{return handleDocumentDelete(e,doc.data().timestamp)}} >delete</button>`
        // })
        // thingsList.innerHTML = items
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
    const auth = getAuth()
    const curUser = auth.currentUser

    // ret()
    if (curUser) {
      console.log("hello we are in the useEffect", curUser.displayName)
      setIsRendered(true)
      setTestUser(curUser)
    } else {
      console.log("hello we are in the useEffect with no user")
      setTestUser(null)
    }
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
    <div
      className="App questions-display-body"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <section>
        <button onClick={onNextPage} className="cool-css home-button-css">
          Home
        </button>
        <ul id="thingsList"></ul>{" "}
        <CreateThing isRendered={isRendered} user={testUser}></CreateThing>
        {/* <button
          className="cool-css"
          id="createThing"
          style={{ display: isRendered ? "block" : "none" }}>
          Make a leetcode question
        </button> */}
        {isRendered ? (
          <div></div>
        ) : (
          <h2 className="margin-0-auto">
            {" "}
            Log in to see your questions list 😊
          </h2>
        )}
      </section>
    </div>
  )
}

export default Questions_display_list
