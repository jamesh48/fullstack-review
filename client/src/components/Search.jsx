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
    const { onChange, search } = this;
    const { term } = this.state;
    const { dropCollections, highlightedUser, highlighted } = this.props;

    return (
      <div id='add-repo-section'>
        {highlightedUser === null ?
          <h4>Add more repos!</h4>
          : null
        }
      Enter a github username: <input value={term} onChange={onChange} />
        <button onClick={search}> Add Repos </button>
        <DropCollections dropCollections={dropCollections} highlighted={highlighted} />
      </div>
    )
  }
}

export default Search;

// curl --head \
//      --header "Authorization: token 072d5ed77769b999d7bab02ce441d2905bff44d3" \
//      https://api.github.com/repos/octokit/core.js/releases/latest
// X-RateLimit-Limit: 5000
// X-RateLimit-Remaining: 4999
// X-RateLimit-Reset: 1578690903