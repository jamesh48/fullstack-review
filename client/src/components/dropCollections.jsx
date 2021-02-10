import React from 'react';

const DropCollections = (props) => {
  return (
    <div>
      <input type = 'button' onClick={props.dropCollections} value='Drop Collections'/>
    </div>
  )
}


export default DropCollections;