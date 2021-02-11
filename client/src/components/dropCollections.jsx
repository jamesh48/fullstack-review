import React from 'react';

const DropCollections = (props) => {
  return (
    <div id='drop-collections-button'>
      <input type = 'button' onClick={props.dropCollections} value='Drop Collections'/>
    </div>
  )
}


export default DropCollections;