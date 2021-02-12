import React from 'react';
const UserLi = (props) => {
  return (
    <li className={props.highlightedUser !== props.user ? 'userLi' : 'highlighted-user-li'} key={props.index} id={props.index} onClick={() => {props.handleUserClick(props.user)}}>{props.user}</li>
  )
}

export default UserLi;