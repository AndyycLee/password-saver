import type { User } from "firebase/auth"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import React from "react"

import { db } from "../firebase_components/firebase_post"

const CreateThing: React.FC<MyComponentProps> = ({
  isRendered,
  user,
  page
}) => {
  if (user) {
    const createThing = document.getElementById("createThing")

    createThing.onclick = async () => {
      // Add a new document to collection leetcode-users-collection with a generated id.
      const docRef = await addDoc(collection(db, "leetcode-users-collection"), {
        notes: `random num: ${Math.random()}`,
        timestamp: serverTimestamp(),
        uid: user.uid,
        link: "https://leetcode.com/problems/diameter-of-binary-tree/"
      })
      console.log("Document written with ID: ", docRef.id)
      // console.log(serverTimestamp())
    }
  }

  return (
    <div>
      <button
        className="cool-css"
        id="createThing"
        style={{
          display: isRendered ? "block" : "none",
          width: page ? 150 : 300
        }}>


{page === 'page1' && <span>Leetcodify</span>}
    {page === 'page2' && <span>Leetcodify Page 2</span>}
    {!page && <span>Make a leetcode question</span>}      </button>
    </div>
  )
}

export default CreateThing

interface MyComponentProps {
  page?: "page1" | "page2"

  isRendered?: boolean
  user?: User
}
