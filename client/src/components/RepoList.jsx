import React from 'react';

const RepoList = (props) => (
  <div>
    <div id='repo-list-title-section'>
      <h4 id='repo-list-title'> Main Repo List</h4>
      <p>There are {props.repos.length} repos.</p>
    </div>
    <ul>
      {props.renderRepos()}
    </ul>
  </div>
)

export default RepoList;