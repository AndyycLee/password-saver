import type { PlasmoContentScript } from "plasmo"
import React from "react"

export {}
console.log("soth any works proof")

export const config: PlasmoContentScript = {
  matches: ["https://leetcode.com/*"]
}

window.addEventListener("load", () => {
  console.log(
    "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
  )

  document.body.style.background = "peachpuff"
})


