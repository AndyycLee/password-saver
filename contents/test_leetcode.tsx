import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://leetcode.com/*"]
}

window.addEventListener("load", () => {
  console.log(
    "Peekaboo! im testing"
  )

  // document.body.style.background = "peachpuff"
})
