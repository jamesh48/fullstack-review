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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.dropCollections = this.dropCollections.bind(this);
    this.renderRepos = this.renderRepos.bind(this);
    this.getRepos = this.getRepos.bind(this);
    this.renderPageNumbers = this.renderPageNumbers.bind(this);
    this.handleClick = this.handleClick.bind(this);


    // this.repoUrl = 'https://whispering-retreat-11430.herokuapp.com/repos';
    // this.dropCollectionUrl = 'https://whispering-retreat-11430.herokuapp.com/dropCollections';
    this.repoUrl = '/repos';
    this.dropCollectionUrl = '/dropCollections';
    this.state = {
      repos: [],
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
                // If Scores are equal, a deathmatch is initiated, with the repo with the longer description prevailing
                if (b.score === a.score) {
                  return b.description.length - a.description.length
                }
                return b.score - a.score
              })
            .slice(0, 25);

            const updatedRepoNum = newResults.filter((repo) => {return !prevState.repos.includes(repo)}).length;
            const importedRepoNum = results.data.length;


            return {
              validated: true,
              repos: newResults,
              totalRepos: newResults.length,
              updatedRepos: updatedRepoNum,
              importedRepos: importedRepoNum
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
    const { renderRepos, search, dropCollections, renderPageNumbers } = this;
    return (
      <div className='app'>
        <h1>Github Fetcher</h1>
        <Search onSearch={search} dropCollections={dropCollections} />

        <Validated totalRepos={totalRepos} updatedRepos = {updatedRepos} importedRepos ={importedRepos} validated={validated} />
        <RepoList repos={repos} renderRepos={renderRepos} />
        <PageNoUL renderPageNumbers={renderPageNumbers} />

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));