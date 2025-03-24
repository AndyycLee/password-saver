import React from "react"

const BodyText = ({ user }) => (
  <h1>
    Enjoy your <span className="orange">Password</span> saving
    {user ? ` ${user.displayName}` : ""}!
  </h1>
)

export default BodyText
