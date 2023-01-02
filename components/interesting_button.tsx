import "./interesting_button.css"
import React from 'react';

type ButtonProps = {
  elementType: string;
  children: any;
  filled?: boolean;
  secondary?: boolean;
  onClick?: () => void;
};

const Button = ({ elementType, children, filled, secondary, onClick, ...rest }: ButtonProps) => {
  return (
    React.createElement(elementType, {
      className: `dir-control ${secondary ? 'dir-control--secondary' : ''} ${filled ? 'dir-control--filled' : ''}`,
      onClick,
      ...rest
    },
      children,
      <span/>,
      <span/>,
      <span/>,
      <span/>,
      <b aria-hidden="true">{children}</b>,
      <b aria-hidden="true">{children}</b>,
      <b aria-hidden="true">{children}</b>,
      <b aria-hidden="true">{children}</b>
    )
  )
}
Button.defaultProps = {
  elementType: 'button'
}

export default Button;

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
