export async function getCurrentTab() {
  try {
      let queryOptions = { active: true,  currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
  } catch(e) {
      console.log(e);
      throw new Error(`Error occurred while trying to get current tab: ${e.message}`);
  }
}


  let testTab = getCurrentTab();
  console.log(
   "Live now; make now always the most precious time. Now will never come again.", testTab
  )
  
