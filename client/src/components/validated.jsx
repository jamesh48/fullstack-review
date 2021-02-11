import React from 'react';
const Validated = (props) => {
  return props.validated === true ?
    <div>
      <h3>Database Updated!</h3>
      <p>Total Repos Imported: {props.totalRepos}</p>
    </div>
    : null
}

export default Validated;