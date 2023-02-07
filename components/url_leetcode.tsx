import { getCurrentTab } from "../background"

const button = document.getElementById("my-button")
// this is the proper way, look at createThing function in createThing.tsx
// const resp = await sendToBackground({
//   name: "ping"
// })


button.onclick = async () => {
  let tab = await getCurrentTab()
  console.log(tab.url)
  console.log(tab)
}

const Content_leetcode = () => {
  return (
    <div>
      <button className="my-button">get Tab URL</button>
    </div>
  )
}

export default Content_leetcode
