import React from 'react';
const RepoEntry = (props) => {
  return (
    <li className='repo-entry'>
      <div>
        <h4>{props.repo.author}</h4>
        <p>{props.repo.repoName}</p>
        <p>{props.repo.description}</p>
        <p>Score {props.repo.score}</p>
      </div>
    </li>
  )
}

export default RepoEntry;