import "../components_css/interesting_button.css"

import React from "react"

//used to have import googleLogo from "../assets/google-login.svg"


type ButtonProps = {
  elementType: string
  children: any
  filled?: boolean
  secondary?: boolean
  onClick?: () => void
}

const Button = ({
  elementType,
  children,
  filled,
  secondary,
  onClick,
  ...rest
}: ButtonProps) => {
  return (
    <>
      <div
        className={`dir-control ${secondary ? "dir-control--secondary" : ""} ${
          filled ? "dir-control--filled" : ""
        }`}
        onClick={onClick}
        {...rest}>

        {children}
        <span />
        <span />
        <span />
        <span />
        <b aria-hidden="true">{children}</b>
        <b aria-hidden="true">{children}</b>
        <b aria-hidden="true">{children}</b>
        <b aria-hidden="true">{children}</b>
      </div>
    </>
  )
}

Button.defaultProps = {
  elementType: "button"
}

export default Button
//Lots of inspiration taken from the person below
//Copyright (c) 2021 by Jhey (https://codepen.io/jh3y/pen/XWMobqx)

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//        {/* <img src={googleLogo} alt="google-logo" className="google-img" style={{ transform: 'translate(0, calc(var(--y, 0) * 1%)) scale(var(--scale, 1))' }} /> */}

// const Button = ({ as, children, filled, secondary, ...rest }) => {
//   const that = {
//     as
//   }
//   return (
//     <that.as
//       className={`dir-control ${secondary ? "dir-control--secondary" : ""} ${
//         filled ? "dir-control--filled" : ""
//       }`}
//       {...rest}>
//       {children}
//       <span />
//       <span />
//       <span />
//       <span />
//       <b aria-hidden="true">{children}</b>
//       <b aria-hidden="true">{children}</b>
//       <b aria-hidden="true">{children}</b>
//       <b aria-hidden="true">{children}</b>
//     </that.as>
//   )
// }
// Button.defaultProps = {
//   as: "button"
// }

// export default Button
