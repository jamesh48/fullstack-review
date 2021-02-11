import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import RepoEntry from './components/repoEntry.jsx';
import DropCollections from './components/dropCollections.jsx';
import styles from './components/app.css'
import Validated from './components/validated.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.dropCollections = this.dropCollections.bind(this);
    this.renderRepos = this.renderRepos.bind(this);
    this.getRepos = this.getRepos.bind(this);

    this.repoUrl = 'https://whispering-retreat-11430.herokuapp.com/repos';
    this.dropCollectionUrl = 'https://whispering-retreat-11430.herokuapp.com/dropCollections';
    this.state = {
      repos: [],
      validated: false,
      totalRepos: 0
    }

  }

  getRepos() {
    const config = {
      method: 'GET',
      url: this.repoUrl
    }

    return axios(config)
      .then((results) => {
        this.setState({
          repos: results.data,
        })
      })
  }

  dropCollections() {
    const config = {
      method: 'GET',
      url: this.dropCollectionUrl
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
      url: this.repoUrl
      data: {
        term: term
      },
      headers: {
        'Content-type': 'application/json'
      }
    }

    return axios(config)
      .then((results) => {
        if (Array.isArray(results.data)) {
          console.log(results.data.length)

          this.setState((prevState) => {

            var newResults = [].concat(prevState.repos, results.data)
            .filter((repo, index, arr) => {
              return arr.indexOf(repo) === index;
            })
            .sort((a, b) => {return b.score - a.score})
            .slice(0, 25);

            var newResultCount = (results.data.length - prevState.repos.length);

            return {
              validated: true,
              repos: newResults,
              totalRepos: newResultCount
            }
          }, () => {
            setTimeout(() => {
              this.setState({
                validated: false
              });
            }, 2000)
          });
        } else {
          //do nothing!
          console.log('nothing!');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  renderRepos() {
    return this.state.repos.map((repo, index) => {
      console.log(repo)
      return <RepoEntry key={index} repo={repo} />
    })
  }
  componentDidMount() {
    this.getRepos();
  }

  render() {
    return (
      <div className='app'>
        <h1>Github Fetcher</h1>
        <Validated totalRepos={this.state.totalRepos} validated={this.state.validated} />
        <RepoList repos={this.state.repos} renderRepos={this.renderRepos} />
        <Search onSearch={this.search} />
        <DropCollections dropCollections={this.dropCollections} />

      </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));