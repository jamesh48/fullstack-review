import React from 'react';

const DropCollections = (props) => {
    {return props.highlighted === true ?
      <div id='drop-collections-button'>
        <input id='inner-button' type='button' onClick={props.dropCollections} value='Drop Collections' />
      </div>
      : null
    }
}


export default DropCollections;