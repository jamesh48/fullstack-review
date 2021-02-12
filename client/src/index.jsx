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
import UserLi from './components/userLi.jsx';
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
    this.handleUserClick = this.handleUserClick.bind(this);


    // this.repoUrl = 'https://whispering-retreat-11430.herokuapp.com/repos';
    // this.dropCollectionUrl = 'https://whispering-retreat-11430.herokuapp.com/dropCollections';
    this.repoUrl = '/repos';
    this.dropCollectionUrl = '/dropCollections';
    this.state = {
      allRepos: [],
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

  handleUserClick(value) {
    if (value === '_all') {
      this.setState(prevState => {
        return {
          repos: prevState.allRepos.slice(0, 25),
          currentPage: 1,
          highlightedUser: value
        }
      })
    } else {
      this.setState(prevState => {
        return {
          repos: prevState.allRepos.filter((repo) => { return repo.author === value }),
          currentPage: 1,
          highlightedUser: value
        }
      })
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
          allRepos: results.data,
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
          allRepos: [],
          repos: [],
          highlightedUser: null
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
            const everyResult = [].concat(prevState.allRepos, results.data)

            // These Lines build an array of users for the unordered list
            const allUsers = everyResult.reduce((total, item) => {
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

            // Finally save the top 25 results to a variable
            const top25Results = everyResult
              .sort((a, b) => {
                // If Scores are equal, a sudden death-match is initiated, with the repo with the longer description prevailing
                if (b.score === a.score) {
                  return b.description.length - a.description.length
                }
                return b.score - a.score
              })
              .slice(0, 25);

            // const updatedRepoNum = newResults.filter((repo) => { return !prevState.allRepos.includes(repo) }).length;
            const updatedRepoNum = top25Results.filter((repo) => {return !prevState.allRepos.includes(repo)}).length;
            const importedRepoNum = results.data.length;

            return {
              validated: true,
              allRepos: everyResult,
              repos: everyResult.filter((result) => {return result.author === term}),
              totalRepos: everyResult.length,
              updatedRepos: updatedRepoNum,
              importedRepos: importedRepoNum,
              highlightedUser: term,
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
  // HandleUserClick -> filter displayed repos based on highlighted user.
  // renderRepos uses totalRepos or filteredRepos to display all repos or the highlighted users repos.
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
    const { users, highlightedUser } = this.state;
    const { handleUserClick } = this;
    return users.map((user, index) => {
      return <UserLi highlightedUser={highlightedUser} user={user} index={index} handleUserClick={handleUserClick} />
    });

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
    const { validated, totalRepos, allRepos, updatedRepos, importedRepos, highlightedUser } = this.state;
    const { renderRepos, search, handleUserClick, dropCollections, renderPageNumbers, renderUsers } = this;
    return (
      <div className='app'>
        <h1>Github Fetcher</h1>
        <Search onSearch={search} dropCollections={dropCollections} />
        <UserList highlightedUser = {highlightedUser} renderUsers={renderUsers} handleUserClick={handleUserClick} />
        <Validated totalRepos={totalRepos} updatedRepos={updatedRepos} importedRepos={importedRepos} validated={validated} />
        <RepoList repos={allRepos} renderRepos={renderRepos} />
        <PageNoUL renderPageNumbers={renderPageNumbers} />

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));