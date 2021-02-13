import React from 'react';
const RepoEntry = (props) => {
  console.log(props.repo.contributors)
  return (
    <li className='repo-entry'>
      {/* <div> */}
        <h4>{props.repo.author}</h4>
        <a target="_blank" href={props.repo.url}>{props.repo.repoName}</a>
        <p>{props.repo.description}</p>
        <p>Score: {props.repo.score}</p>
        <hr/>
        <h4 className='contributor-title'>Contributors:</h4>
        <div className='contributors-container'>
        {props.repo.contributors.map(contributor => {
          return <a href={contributor.url} className='contributor'>{contributor.contributor}</a>
        })}
        </div>
      {/* </div> */}
    </li>
  )
}

export default RepoEntry;