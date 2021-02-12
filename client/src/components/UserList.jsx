import React from 'react';

const UserList = (props) => {
  return (
    <ul>
      <li className={props.highlightedUser === '_all' ? 'highlighted-user-li' : 'userLi'} key={0} id={0} onClick={() => {props.handleUserClick('_all')}}>Top 25</li>
      {props.renderUsers()}
    </ul>
  )
}

export default UserList;

