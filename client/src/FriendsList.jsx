import React from 'react';

const FriendsList = (props) => {
  return (
    <div>

    </div>
  )
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
