import { getCurrentTab } from "../background/index"

const button = document.getElementById("my-button")

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
