import React from 'react';
import DropCollections from './dropCollections.jsx'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      term: ''
    }
  }

  onChange(e) {
    this.setState({
      term: e.target.value
    });
  }

  search() {
    return this.props.onSearch(this.state.term)
    .then(() => {
      this.setState({
        term: ''
      })
    })



  }

  render() {
    return (
      <div id='add-repo-section'>
        <h4>Add more repos!</h4>
      Enter a github username: <input value={this.state.term} onChange={this.onChange} />
        <button onClick={this.search}> Add Repos </button>
        <DropCollections dropCollections={this.props.dropCollections}/>
      </div>
    )
  }
}

export default Search;