import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import Search from './components/Search.jsx';
import PageNumber from './components/PageNumber.jsx'
import RepoList from './components/RepoList.jsx';
import RepoEntry from './components/repoEntry.jsx';
import styles from './components/app.css'
import Validated from './components/validated.jsx';
import PageNoUL from './components/PageNoUl.jsx';
import UserList from './components/UserList.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.dropCollections = this.dropCollections.bind(this);
    this.renderRepos = this.renderRepos.bind(this);
    this.getRepos = this.getRepos.bind(this);
    this.renderPageNumbers = this.renderPageNumbers.bind(this);
    this.renderUsers = this.renderUsers.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleUserClick =this.handleUserClick.bind(this);


    // this.repoUrl = 'https://whispering-retreat-11430.herokuapp.com/repos';
    // this.dropCollectionUrl = 'https://whispering-retreat-11430.herokuapp.com/dropCollections';
    this.repoUrl = '/repos';
    this.dropCollectionUrl = '/dropCollections';
    this.state = {
      repos: [],
      users: [],
      highlightedUser: [],
      validated: false,
      totalRepos: 0,
      currentPage: 1,
      reposPerPage: 5,
      updatedRepos: 0,
      importedRepos: 0
    }

  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    })
  }

  handleUserClick(event) {
    console.log(event.target.value);
    this.setState({
      highlightedUser: event.target.value
    })
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
          users: []
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
      url: this.repoUrl,
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

          this.setState((prevState) => {
            var newResults = [].concat(prevState.repos, results.data)
              .sort((a, b) => {
                // If Scores are equal, a sudden death-match is initiated, with the repo with the longer description prevailing
                if (b.score === a.score) {
                  return b.description.length - a.description.length
                }
                return b.score - a.score
              })

            // These Lines build an array of users for the unordered list
            const allUsers = newResults.reduce((total, item) => {
              if (!total.includes(item.author)) {
                total.push(item.author);
                return total;
              }
              return total;
            }, [])
            // concat the prevState so that users are not removed when the main repo list no longer includes them
            .concat(prevState.users)
            // Filter to remove duplicate users
            .filter((item, index, arr) => {
              return arr.indexOf(item) === index;
            })
            // Finally limit the total results returned from post request to 25
            newResults = newResults.slice(0, 25);

            const updatedRepoNum = newResults.filter((repo) => { return !prevState.repos.includes(repo) }).length;
            const importedRepoNum = results.data.length;

            return {
              validated: true,
              repos: newResults,
              totalRepos: newResults.length,
              updatedRepos: updatedRepoNum,
              importedRepos: importedRepoNum,
              users: allUsers
            }
          }, () => {
            setTimeout(() => {
              this.setState({
                validated: false
              });
            }, 2000)
          });
        } else {
          //If an Array isn't sent back from the server, do nothing (currently deprecated);
          console.log('nothing!');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  renderRepos() {
    const { repos, currentPage, reposPerPage } = this.state;
    const indexOfLastTodo = currentPage * reposPerPage;
    const indexOfFirstTodo = indexOfLastTodo - reposPerPage;
    const currentRepos = repos.slice(indexOfFirstTodo, indexOfLastTodo);

    return currentRepos.map((repo, index) => {
      return <RepoEntry key={index} repo={repo} />
    })
    // return this.state.repos.map((repo, index) => {
    //   return <RepoEntry key={index} repo={repo} />
    // })
  }

  renderUsers() {
    const { users } = this.state;
    return users.map((user, index) => {
      return <li className='userLi' key={index} onClick={this.handleUserClick} value={user}>{user}</li>
    })

  }

  renderPageNumbers() {
    const { repos, currentPage, reposPerPage } = this.state;
    const { handleClick } = this;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(repos.length / reposPerPage); i++) {
      pageNumbers.push(i)
    }

    return pageNumbers.map((number, index, arr) => {
      return <PageNumber index={number} handleClick={handleClick} />
    })

  }

  componentDidMount() {
    this.getRepos();
  }

  render() {
    const { validated, totalRepos, repos, updatedRepos, importedRepos } = this.state;
    const { renderRepos, search, dropCollections, renderPageNumbers, renderUsers } = this;
    return (
      <div className='app'>
        <h1>Github Fetcher</h1>
        <Search onSearch={search} dropCollections={dropCollections} />
        <UserList renderUsers={renderUsers} />
        <Validated totalRepos={totalRepos} updatedRepos={updatedRepos} importedRepos={importedRepos} validated={validated} />
        <RepoList repos={repos} renderRepos={renderRepos} />
        <PageNoUL renderPageNumbers={renderPageNumbers} />

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));