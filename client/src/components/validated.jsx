import React from 'react';
const Validated = (props) => {
  return props.validated === true ?
    <div className={props.importedRepos === 0 && props.updatedRepos === 0 ? 'invalidated' : 'validated'}>
      <h3>Database Updated!</h3>
      <p>{props.importedRepos} Repos Imported!</p>
      {/* Updated On Client Side-> */}
      <p>{props.updatedRepos} Added to the Top 25!</p>
      <p>Total Repos: {props.totalRepos}</p>
    </div>
    : null
}

export default Validated;