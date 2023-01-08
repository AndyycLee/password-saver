const button = document.getElementById("my-button")

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

if (button) {
  button.onclick = async () => {
    const tab = await getCurrentTab()
    console.log(tab.url)
  }
}

const Content_leetcode = () => {
  return (
    <div>
      <button className="my-button">fucking Tab URL</button>
    </div>
  )
}

export default Content_leetcode
