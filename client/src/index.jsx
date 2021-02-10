import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import DropCollections from './components/dropCollections.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.dropCollections = this.dropCollections.bind(this);

    this.state = {
      repos: []
    }

  }

  dropCollections() {
    const config = {
      method: 'GET',
      url: '/dropCollections',
    }
    return axios(config)
      .then((results) => {
        console.log('dropped collections');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  search(term) {
    console.log(`${term} was searched`);
    const config = {
      method: 'POST',
      url: '/repos',
      data: {
        term: term
      }
    }

    return axios(config)
      .then((results) => {
        console.log(results);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos} />
      <Search onSearch={this.search} />
      <DropCollections dropCollections={this.dropCollections} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));