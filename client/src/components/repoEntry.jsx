import React from 'react';
const RepoEntry = (props) => {
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
        {props.repo.publicContributors.map((pContributor, index) => {
          return <a target='_blank' key={index} href={pContributor.url} className='contributor'>{pContributor.contributor}</a>
        })}
        </div>
      {/* </div> */}
    </li>
  )
}

export default RepoEntry;