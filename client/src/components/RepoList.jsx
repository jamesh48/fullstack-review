import React from 'react';

const RepoList = (props) => (
  <div>
    <h4> Repo List Component </h4>
    <p>There are {props.repos.length} repos.</p>
    <ul>
       {props.renderRepos()}
    </ul>
  </div>
)

export default RepoList;