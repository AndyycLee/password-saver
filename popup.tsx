import { MemoryRouter } from "react-router-dom"

import IndexPopupMain from "~components/main"
// import Questions_display_list from "~components/questions_display_list"
import { Routing } from "~routes"

function IndexPopup() {
  //RETURN TSX
  return (
    <MemoryRouter>
      <Routing />

    </MemoryRouter>
  )
}

export default IndexPopup
