import React from "react"

import "../components_css/unlocked_logo_style.css"

// @ts-ignore
import unlocked_logo from "../assets/unlocked_logo.png"

const ImageLink = () => (
  <a
    href="https://ctftime.org/ctf-wtf/"
    target="_blank"
    rel="noopener noreferrer"
    className="test">
    <img src={unlocked_logo} className="App-logo" alt="logo" />
  </a>
)

export default ImageLink
