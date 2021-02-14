const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const Repo = require('../database/index.js').Repo;
const User = require('../database/index.js').User;

const config = require('../config.js');
const getReposByUsername = require('../helpers/github.js').getReposByUsername;
const saveRepos = require('../database/index.js').saveRepos;
const saveUser = require('../database/index.js').saveUser;


// Get User Repos->
router.get('/repos/user', (req, res) => {
  const user = req.query.user
  return getUserRepos(user)
    .then((userRepos) => {
      res.status(200).send(userRepos);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    })
})

const getUserRepos = async (user) => {
  const userModel = await User.findOne({ user: user })
    .populate('repos')
    .exec()

  let userRepos = userModel._doc.repos.map(repoModel => {
    return repoModel._doc;
  })
    .sort((a, b) => { return b.score - a.score })
    .slice(0, 10);

  let userFriendList = userModel._doc.friendsList;
  let responseArr = [userRepos, userFriendList];
  return responseArr;
}




// ------------------------------------------------

// Post User Repos->
router.post('/repos', (req, res) => {
  const ghUsername = req.body.term;
  return postUserRepos(ghUsername, (err, result) => {
    if (err) {
      console.log(err);
      res.status(403).send('error');
    } else {
      // console.log(result);
      res.status(200).send(result);
    }
  })
  // .then((finalRepoResults) => {
  //   res.status(200).send(finalRepoResults);
  // })
  // .catch((err) => {
  //   // console.log('test');
  //   // res.status(500)
  //   console.log(err)
  //   res.status(500).send({ err: err });
  // })
});


const postUserRepos = async (ghUsername, cb) => {
  const config = getReposByUsername(ghUsername);

  try {
    let cache = {}
    let repos = await axios(config);
    repos = repos.data
      .sort((a, b) => {
        var aDescriptionScore = a.description ? 1 : 0;
        var bDescriptionScore = b.description ? 1 : 0;

        const aScore = a.stargazers_count + a.watchers_count + a.forks_count + aDescriptionScore;
        const bScore = b.stargazers_count + b.watchers_count + b.forks_count + bDescriptionScore;

        return (bScore - aScore)
      }).map((entry, index) => {
        return new Promise(async (resolve, reject) => {
          const result = await saveRepos(entry, ghUsername)
          resolve(result);
        })
      })

    let finalRepoResults = await Promise.all(repos)
    // console.log(finalRepoResults);

    const foreignKeysArr = finalRepoResults.map((model) => {
      return model._doc._id;
    })

    // const fList = finalRepoResults.reduce((friendsList, repoModel) => {
    //   var publicContributors = repoModel._doc.publicContributors;
    //   publicContributors.forEach(contributor => {
    //     if (friendsList.some(potentialFriend => potentialFriend !== contributor.handle) || friendsList.length === 0) {
    //       friendsList.push(contributor.handle);
    //       // return [...friendsList, contributor.handle];
    //     }
    //   })
    //   return friendsList;
    // }, []);

    var friendsList = finalRepoResults.map((repoModel) => {
      var publicContributors = repoModel._doc.publicContributors;
      return publicContributors.reduce((total, contributor) => {
        let test = total.find((item) => {
          return item === contributor.handle;
        })

        if (!test) {
          total.push(contributor.handle)
        }

        return total;
      }, [])
    })

    friendsList = [].concat.apply([], friendsList).filter((friend, index, arr) => { return arr.indexOf(friend) === index });

    await saveUser(ghUsername, foreignKeysArr, friendsList);
    let responseArr = [finalRepoResults, friendsList];
    // return finalRepoResults;
    cb(null, responseArr)

  } catch (err) {
    console.log('hello')
    // do nothing
    // res.status(403).send('error')
    cb(err);
  }
}

// ------------------------------------------------
// Get Top Repos on Refresh->    d
router.get('/repos', (req, res) => {
  getTopRepos()
    .then((responseArr) => {
      res.status(200).send(responseArr);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
})

const getTopRepos = async () => {
  // Returns 25 repos...
  let repos = await Repo.find({})
    .populate('contributors')
    .sort('-score')
    .limit(25)

  repos = Object.keys(repos)
    .reduce((total, key, index, arr) => {
      total.push(repos[key]._doc);
      return total
    }, [])

  const userModels = await User.find({});
  const responseArr = []
  responseArr.push(repos, userModels)
  return responseArr;
}
// ------------------------------------------------
// Drop Collections->
router.get('/dropCollections', (req, res) => {
  const connection = mongoose.connection;
  connection.db.listCollections().toArray((err, names) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      if (names.length === 0) {
        res.status(200).send('No Collections to Drop!')
      } else {
        for (let i = 0; i < names.length; i++) {
          console.log(names[i].name)
          mongoose.connection.db.dropCollection(names[i].name, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: err });
            } else {
              console.log(names[i].name + ' Dropped!');
            }
          })
        }
        res.status(200).send('Dropped Collections!');
      }
    }
  })
})

module.exports = router;