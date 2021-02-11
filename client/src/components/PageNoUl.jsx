import React from 'react';
const PageNoUL = (props) => {
  return (
    <ul>
      {props.renderPageNumbers()}
    </ul>
  )
}
export default PageNoUL;