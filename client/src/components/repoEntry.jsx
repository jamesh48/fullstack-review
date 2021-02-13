import React from 'react';
const RepoEntry = (props) => {
  console.log(props.repo.contributors)
  return (
    <li className='repo-entry'>
      <div>
        <h4>{props.repo.author}</h4>
        <a target="_blank" href={props.repo.url}>{props.repo.repoName}</a>
        <p>{props.repo.description}</p>
        <p>Score: {props.repo.score}</p>
        {props.repo.contributors.map(contributor => {
          return <p>Contributor: {contributor.contributor}</p>
        })}
      </div>
    </li>
  )
}

export default RepoEntry;