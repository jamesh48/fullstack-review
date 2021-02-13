import React from 'react';
const PageNumber = (props) => {
  return (
    <li
      className='page-nos'
      id={props.index}
      onClick={props.handleClick}
      href=''
    >
      {props.index}
    </li>
  )
}

export default PageNumber;