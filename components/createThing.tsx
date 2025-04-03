import { sendToBackground } from "@plasmohq/messaging"
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
      //get the current tab

      try {
        const resp = await sendToBackground({
          name: "ping"
        })

        let notesParam

        if (
          resp === undefined ||
          resp.tab === undefined ||
          resp.tab.url === undefined
        ) {
          console.log(
            "Error: resp or resp.tab or resp.tab.url is undefined click on the page again"
          )
          notesParam = "Error: Click on the page again and reopen the extension"
        } else {
          const testTab = await resp.tab
          console.log(testTab)
          const tabUrl = await testTab.url
          console.log(tabUrl)
          let r = (Math.random() + 1).toString(36).substring(2)

          if (!tabUrl.includes("leetcode.com/problems/")) {
            console.log("Error: not a leetcode problem")
            notesParam = `${testTab.title}`
          } else {
            //get notes for leetcode question
            let problemName = tabUrl.match(/\/problems\/(.*)/)[1]
            let problemSplitted = problemName
              .split("-")
              .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
            let problem = problemSplitted.join(" ").replace(/\/$/, "")
            console.log(problem)
            notesParam = problem

            console.log(problem)
          }
          // Add a new document to collection leetcode-users-collection with a generated id.
          const docRef = await addDoc(
            collection(db, "password-users-collection"),
            {
              key: `${notesParam}`,
              timestamp: serverTimestamp(),
              uid: user.uid,
              link: tabUrl,
              value: `${r}`
            }
          )
          console.log("Document written with ID: ", docRef.id)
          console.log(serverTimestamp())
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <div>
      <button
        className="cool-css"
        id="createThing"
        style={{
          display: isRendered ? "block" : "none",
          width: page ? 240 : 300,
          marginTop: 10
        }}>
        {page === "page1" && <span>Webpage to Password</span>}
        {page === "page2" && <span>Leetcodify Page 2</span>}
        {!page && <span>Save a Password! </span>}{" "}
      </button>
    </div>
  )
}

export default CreateThing

interface MyComponentProps {
  page?: "page1" | "page2"
  getUrl?: () => Promise<void>

  isRendered?: boolean
  user?: User
  userAccessToken?: string
  // setWebsiteUrl?: (url: string) => void
}
