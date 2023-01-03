import "./interesting_button.css"

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
