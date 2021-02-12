import React from 'react';

const RepoList = (props) => (
  <div>
    {props.highlightedUser === '_all' ?
      <div id='repo-list-title-section'>
        <h3 id='repo-list-title'> Main Repo List</h3>
        <h4>There are {props.totalRepos} total repos.</h4>
        <h4>Here are the top {props.displayedRepos.length}:</h4>
      </div>

      : props.highlightedUser !== null ?
        <div id='repo-list-title-section'>
          <h3 id='repo-list-title'> {props.highlightedUser}'s Repo List:</h3>
          <h4>Users top {props.displayedRepos.length} Repos!</h4>
        </div>

        : null
    }

    <ul>
      {props.renderRepos()}
    </ul>
  </div>
)

export default RepoList;