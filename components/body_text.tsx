import React from "react"

const BodyText = ({ user }) => (
  <h1>
    Enjoy your{" "}
    <a
      className="App-link"
      href="https://passwords.google.com/"
      target="_blank"
      rel="noopener noreferrer">
      <span className="orange">Password</span>{" "}
    </a>
    saving
    {user ? ` ${user.displayName}` : ""}!
  </h1>
)

export default BodyText
