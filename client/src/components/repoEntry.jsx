import React from 'react';
const RepoEntry = (props) => {
  return (
    <li className='repo-entry'>
      <div>
        <h4>{props.repo.author}</h4>
        <a target="_blank" href={props.repo.url}>{props.repo.repoName}</a>
        <p>{props.repo.description}</p>
        <p>Score: {props.repo.score}</p>
        <p>Contributors: {props.repo.contributors}</p>
      </div>
    </li>
  )
}

export default RepoEntry;