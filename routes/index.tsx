import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import type { User } from "firebase/auth"

import IndexPopupMain from "../components/main"
import Questions_display_list from "../components/questions_display_list"

export const Routing = () => {
  const [globalUserAuthorized, setglobalUserAuthorized] = useState<User>(null)
  
  return (
    <Routes>
      <Route path="/" element={<IndexPopupMain setglobalUserAuthorized= {setglobalUserAuthorized}/>} />
      <Route path="/questions_list" element={<Questions_display_list globalUserAuthorized={globalUserAuthorized} />} />
    </Routes>
  )
}
