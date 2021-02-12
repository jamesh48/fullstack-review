import React from 'react';

const RepoList = (props) => (
  <div>
    {props.highlightedUser === '_all' ?
      <div id='repo-list-title-section'>
        <h4 id='repo-list-title'> Main Repo List</h4>
        <p>There are {props.allRepos.length} total repos.</p>
        <h5>Here are the top {props.repos.length}:</h5>
      </div>

      : props.highlightedUser !== null ?
        <div id='repo-list-title-section'>
          <h3 id='repo-list-title'> {props.highlightedUser}'s Repo List</h3>
          <h4>There are {props.repos.length} repos.</h4>
        </div>

        : null
    }

    <ul>
      {props.renderRepos()}
    </ul>
  </div>
)

export default RepoList;