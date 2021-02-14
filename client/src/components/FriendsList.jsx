import React from 'react';

const FriendsList = (props) => {
  return props.friendsList !== null ?
    <div>
      <span id='friends-list-title-section'>
        <h3 className='fortune-title'>{props.highlightedUser}'s friends List:</h3>
      </span>
      <div id='friends-list-container'>
        {props.friendsList !== undefined ? props.friendsList.map((friend) => {
          return <p className='friend'>{friend}</p>
        }) : null}
      </div>
    </div>
    : null
}



export default FriendsList;

// Todo

// Database
// Contributor Table when importing
  // Each Repo has foreign key with contributors array

// Client Side
  // FriendsList Component
  // When User is Clicked on, the get request additionally returns contributors


  // Sever Side
    // Receiving user click, the server queries the database for contributors for each repo inside the map function...calls findOne on each repo and populates that repo before returning...
