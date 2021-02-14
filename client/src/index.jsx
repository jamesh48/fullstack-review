import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import Search from './components/Search.jsx';
import PageNumber from './components/PageNumber.jsx'
import RepoList from './components/RepoList.jsx';
import RepoEntry from './components/repoEntry.jsx';
import styles from './components/app.css';
import FriendsList from './components/FriendsList.jsx';
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
    this.getUserRepos = this.getUserRepos.bind(this);
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
      displayedRepos: [],
      users: [],
      highlightedUser: null,
      highlighted: false,
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
    this.setState(prevState => {
      return {
        displayedRepos: value === '_all' ? prevState.allRepos.slice(0, 25) : prevState.allRepos.filter((repo) => { return repo.author === value }),
        currentPage: 1,
        highlightedUser: value
      }
    })
  }

  // getAllRepos(value) {
  //   config = {
  //     method: 'GET',
  //     url: this.repoUrl,
  //     params: {
  //       user: value
  //     }
  //   }
  //   return axios(config)
  //     .then((results) => {
  //       console.log(results.data.length);
  //     })
  // }

  getUserRepos(value) {
    const config = {
      method: 'GET',
      url: this.repoUrl + '/user',
      params: {
        user: value
      }
    }

    return axios(config)
      .then((results) => {
        // console.log(results.data[0]);
        // console.log(results.data[1]);
        console.log(value);
        this.setState({
          highlightedUser: value,
          friendsList: value !== '_all' ? results.data[1] : null,
          displayedRepos: results.data[0],
          currentPage: 1
        })
      })
      .catch((err) => {
        console.log(err.err);
      })
  }

  getRepos() {
    const config = {
      method: 'GET',
      url: this.repoUrl
    }

    return axios(config)
      .then((resultsArr) => {
        var repoArr = resultsArr.data[0];
        var totalRepos = 0;
        var users = resultsArr.data[1].map((user) => {
          totalRepos += user.repos.length;
          return user.user;
        });
        // const users = resultsArr.data;
        this.setState({
          displayedRepos: repoArr,
          totalRepos: totalRepos,
          users: users,
          friendsList: null,
          // highlightedUser: '_all',
          // highlightedUser: users[0],
          highlightedUser: users.length > 0 ? '_all' : null,
          highlighted: (resultsArr.data[0].length > 0),
          currentPage: 1
        })
        // console.log(resultsArr.data);
      })
  }

  dropCollections() {
    const config = {
      method: 'GET',
      url: this.dropCollectionUrl
    }
    return axios(config)
      .then((results) => {
        // Resets the App
        this.setState(prevState => {
          return {
            allRepos: [],
            displayedRepos: [],
            users: [],
            highlightedUser: null,
            friendsList: null,
            validated: false,
            highlighted: false,
            totalRepos: 0,
            currentPage: 1,
            reposPerPage: 5,
            updatedRepos: 0,
            importedRepos: 0
          }
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
        if (Array.isArray(results.data[0])) {
          this.setState((prevState) => {
            let everyResult = results.data[0];
            const friendsList = results.data[1];
            everyResult = [].concat(prevState.allRepos, everyResult)

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

            // var resultArr = [];
            // allUsers.forEach(user => {
            //   var test = everyResult.reduce((total, repo) => {
            //     if (repo.author === user) {
            //       repo.publicContributors.forEach(pC => {
            //         if (!total.includes(pC.contributor)) {
            //           total.push(pC.contributor, pC.url);
            //         }
            //       })
            //     }
            //     return total;
            //   }, [])
            //   resultArr = resultArr.concat(test);
            // })
            // var otherArr = [];
            // for (let i = 0; i < resultArr.length; i+= 2) {
            //   otherArr.push([resultArr[i], resultArr[i + 1]]);
            // }
            // console.log(otherArr);

            // Finally save the top 25 results to a variable
            const top25Results = everyResult
              .sort((a, b) => {
                return b.score - a.score
              })
              .slice(0, 25);

            // const updatedRepoNum = newResults.filter((repo) => { return !prevState.allRepos.includes(repo) }).length;
            const updatedRepoNum = top25Results.filter((repo) => { return !prevState.allRepos.includes(repo) }).length;
            const importedRepoNum = everyResult.length;

            return {
              friendsList: friendsList,
              validated: true,
              allRepos: everyResult,
              displayedRepos: everyResult.filter((result) => { return result.author === term }).slice(0, 10),
              totalRepos: everyResult.length,
              highlighted: (everyResult.length > 0),
              updatedRepos: updatedRepoNum,
              importedRepos: importedRepoNum,
              highlightedUser: term,
              users: allUsers,
              currentPage: 1
            }
          }, () => {
            setTimeout(() => {
              this.setState({
                validated: false
              });
            }, 5000)
          });
        } else {
          //If an Array isn't sent back from the server, do nothing
          console.log('nothing!');
        }
      })
      .catch((err) => {
        console.log(err);
        window.open(`https://github.com/login/oauth/authorize`)
      })
  }
  // HandleUserClick -> filter displayed repos based on highlighted user.
  // renderRepos uses totalRepos or filteredRepos to display all repos or the highlighted users repos.
  renderRepos() {
    const { displayedRepos, currentPage, reposPerPage } = this.state;
    const indexOfLastRepo = currentPage * reposPerPage;
    const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
    const currentRepos = displayedRepos.slice(indexOfFirstRepo, indexOfLastRepo);
    // console.log(currentRepos);
    return currentRepos.map((repo, index) => {
      return <RepoEntry key={index} repo={repo} />
    })
    // return this.state.repos.map((repo, index) => {
    //   return <RepoEntry key={index} repo={repo} />
    // })
  }

  renderUsers() {
    const { users, highlightedUser } = this.state;
    const { handleUserClick, getUserRepos } = this;
    // console.log(users);
    return users.map((user, index) => {
      return <UserLi getUserRepos={getUserRepos} highlightedUser={highlightedUser} user={user} key={index} handleUserClick={handleUserClick} />
    });

  }

  renderPageNumbers() {
    const { displayedRepos, currentPage, reposPerPage } = this.state;
    const { handleClick } = this;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(displayedRepos.length / reposPerPage); i++) {
      pageNumbers.push(i)
    }

    return pageNumbers.map((number, index, arr) => {
      return <PageNumber index={number} key={index} handleClick={handleClick} />
    })

  }

  componentDidMount() {
    console.log('component did mount');
    this.getRepos();
  }

  render() {
    const { validated, totalRepos, displayedRepos, allRepos, updatedRepos, importedRepos, highlightedUser, highlighted, friendsList } = this.state;
    const { getRepos, renderRepos, search, handleUserClick, dropCollections, renderPageNumbers, renderUsers } = this;
    return (
      <div className='app'>
        <h1>Github Fetcher</h1>
        <Search onSearch={search} dropCollections={dropCollections} highlightedUser={highlightedUser} highlighted={highlighted} />
        <UserList getRepos={getRepos} highlightedUser={highlightedUser} renderUsers={renderUsers} handleUserClick={handleUserClick} />
        <Validated totalRepos={totalRepos} updatedRepos={updatedRepos} importedRepos={importedRepos} validated={validated} />
        <FriendsList highlightedUser={highlightedUser} friendsList={friendsList}/>
        <RepoList highlightedUser={highlightedUser} totalRepos={totalRepos} displayedRepos={displayedRepos} renderRepos={renderRepos} />
        <PageNoUL renderPageNumbers={renderPageNumbers} />

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

