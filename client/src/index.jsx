import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import DropCollections from './components/dropCollections.jsx';
import Validated from './components/validated.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.dropCollections = this.dropCollections.bind(this);
    this.renderRepos = this.renderRepos.bind(this);
    this.getRepos = this.getRepos.bind(this);

    this.state = {
      repos: [],
      validated: false
    }

  }

  getRepos() {
    const config = {
      method: 'GET',
      url: '/repos'
    }

    return axios(config)
      .then((results) => {
        this.setState({
          repos: results.data
        })
      })
  }

  dropCollections() {
    const config = {
      method: 'GET',
      url: '/dropCollections',
    }
    return axios(config)
      .then((results) => {
        this.setState({
          repos: []
        })
        console.log(results.data);
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
        this.setState({
          validated: true
        }, () => {
          setTimeout(() => {
            console.log('hello');
            this.setState({
              validated: false
            });
          }, 2000)
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }

  renderRepos() {

  }
  componentDidMount() {
    this.getRepos();
  }

  render() {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos} />
      <Search onSearch={this.search} />
      <DropCollections dropCollections={this.dropCollections} />
      <Validated validated={this.state.validated} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));