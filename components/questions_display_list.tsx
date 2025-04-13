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
  updateDoc,
  where
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

import { auth } from "../firebase"
import { db } from "../firebase_components/firebase_post"
import { decryptValue, encryptValue } from "./encryption"

// 🔁 use AES methods

import "../components_css/questions_display.css"

import type { User } from "firebase/auth"
import React from "react"

// import Button from "./interesting_button"

import CreateThing from "./createThing"

// import Dropdown from "./dropdown"

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
    const docRef = doc(db, "password-users-collection", timestamp)
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
  //ret is optional, thats the beauty of onAuthStateChanged, it runs immediately if its thedefault tab, otherwise you need UseEffect to wake up the page, and then it will be an observer
  // and it will find that user and then runs again when the auth state changes, so itwakes up and does its run on navigation, and then it runs again when the auth state changes
  //onAuthStateChanged method will run on page load or navigation, in addition to running every time there is a change in the authentication state

  //because my sign in is on a different page, i could have useEffect auth = getAuth()and then render the UI instead of the wakey method of OnAtuhStateChange
  //tbh this isnt really the react way cuz im not managaing state, im kinda just seeing if there is a user since the onAuthStateChanged seems to run after the page has something load
  // so if there is a user (found by importing auth) then i render the UI, else hide the UI
  let ret = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Show the UI.
      if (thingsList) {
        createThing.style.display = "block"
        thingsList.style.display = "block"
      }

      const q = query(
        collection(db, "password-users-collection"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      )
      //firebase is realtime, so onsnapshot rerenders the list everytime there is a change in the database
      // basically it is a listener, and it will run everytime there is a change in the database and if the user is signed in cuz of onAuthStateChanged which calls the onSnapshot
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        thingsList.innerHTML = "" // clear the thingsList element
        querySnapshot.forEach((doc) => {
          // create list item element
          const listItem = document.createElement("li")
          listItem.setAttribute("class", "my-li-class")

          // create key element
          const keyElement = document.createElement("input")
          keyElement.setAttribute("class", "key-class")
          keyElement.value = doc.data().key // Set the initial value
          keyElement.onchange = async function (e) {
            // Persist key field changes to Firebase
            const newValue = (e.target as HTMLInputElement).value
            try {
              await updateDoc(doc.ref, { key: newValue })
              console.log("Key updated to:", newValue)
            } catch (error) {
              console.error("Error updating key:", error)
            }
          }

          // create value element
          const valueElement = document.createElement("input")
          valueElement.setAttribute("class", "value-class")
          valueElement.value = doc.data().value // Set the initial value
          valueElement.onchange = async function (e) {
            const newValue = (e.target as HTMLInputElement).value
            try {
              const encrypted = await encryptValue(newValue)
              await updateDoc(doc.ref, { value: encrypted })
              console.log("Encrypted value updated")
            } catch (error) {
              console.error("Error updating encrypted value:", error)
            }
          }

          // create reveal button element
          const copyButton = document.createElement("button")
          copyButton.textContent = "Copy"
          copyButton.className = "cool-css"
          copyButton.onclick = async () => {
            try {
              const encrypted = doc.data().value
          
              if (!encrypted.match(/^[A-Za-z0-9+/=]+$/)) {
                throw new Error("Value is not valid Base64. Not encrypted?")
              }
          
              const decrypted = await decryptValue(encrypted)
              await navigator.clipboard.writeText(decrypted)
              console.log("Copied decrypted text:", decrypted)
              console.log("Encrypted text:", encrypted)
              copyButton.textContent = "Copied!"
              setTimeout(() => (copyButton.textContent = "Copy"), 1500)
            } catch (err) {
              console.error("Clipboard copy failed:", err)
              copyButton.textContent = "Error"
              setTimeout(() => (copyButton.textContent = "Copy"), 1500)
            }
          }
          

          // create delete button element
          const deleteButton = document.createElement("button")
          deleteButton.className = "deleter-collection cool-css"
          deleteButton.textContent = "\u00D7"
          deleteButton.onclick = function (e) {
            handleDocumentDelete(e, doc.id)
          }

          // append key and value elements to list item
          listItem.appendChild(keyElement)
          listItem.appendChild(valueElement)
          // append delete button to list item
          listItem.appendChild(copyButton)
          listItem.appendChild(deleteButton)

          // append list item to thingsList element
          thingsList.appendChild(listItem)
          console.log("hello onSnapshot", listItem)
        })
      })
    } else {
      // Why the UI hiding is uncessary: 1. createThing is rendered by isRendered (checks for auth user) 2. thingsList is initally empty, only rendered elements after if theres a user
      // the initally empty list is populated by the onSnapshot listener , only called if there is a user (onAuthStateChanged)
      // createThing.style.display = "none"
      // thingsList.style.display = "none"

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
      <section className="flex-column">
        <button onClick={onNextPage} className="cool-css home-button-css">
          Home
        </button>
        <ul id="thingsList"></ul>{" "}
        <CreateThing isRendered={isRendered} user={testUser}></CreateThing>
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
