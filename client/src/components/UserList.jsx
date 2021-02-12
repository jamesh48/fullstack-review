import React from 'react';

const UserList = (props) => {

  return (
    <ul>
      {props.renderUsers()}
    </ul>
  )
}

export default UserList;

