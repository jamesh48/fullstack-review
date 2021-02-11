import React from 'react';
const Validated = (props) => {
  return props.validated === true ?
    <div>
      <h3>Database Updated!</h3>
    </div>
    : null
}

export default Validated;