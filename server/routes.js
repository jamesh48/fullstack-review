const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const Repo = require('../database/index.js').Repo;
const User = require('../database/index.js').User;

const config = require('../config.js');
const getReposByUsername = require('../helpers/github.js').getReposByUsername;
const save = require('../database/index.js').save
const saveUser = require('../database/index.js').saveUser;


// router.post('/repos', (req, res) => {
//   const ghUsername = req.body.term;
//   const config = getReposByUsername(ghUsername);
//   return axios(config)
//     .then((results) => {
//       var test = ghUsername
//       return results.data.reduce((total, item, index) => {
//         var json = {};
//         json[item.name] = item;
//         if (!total[ghUsername]) {
//           total[ghUsername] = json;
//         } else {
//           total[ghUsername] += json;
//         }
//         return total;
//       }, {})
//     })
//     .then((niceObject) => {

//       res.status(200).send([])
//     })
//     .catch((err) => {
//       console.log(err);
//     })
// })

router.get('/repos/user', (req, res) => {

  const user = req.query.user
  return User.findOne({ user: user })
    .populate('repos')
    .exec()
    .then((userModel) => {
      return userModel._doc.repos.map(repoModel => {
        return repoModel._doc
      })
        .sort((a, b) => { return b.score - a.score })
        .slice(0, 10);
    })
    .then((repos) => {
      res.status(200).send(repos)
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    })
});

// router.get('/repos/allRepos', (req, res) => {
//   return Repo.find({})
//     .sort('-score')
//     .limit(25)

// })
// })

router.post('/repos', function (req, res) {
  const ghUsername = req.body.term;
  const config = getReposByUsername(ghUsername);

  return axios(config)
    .then((results) => {
      return results.data
        .sort((a, b) => {
          var aDescriptionScore = a.description ? 1 : 0;
          var bDescriptionScore = b.description ? 1 : 0;

          const aScore = a.stargazers_count + a.watchers_count + a.forks_count + aDescriptionScore;
          const bScore = b.stargazers_count + b.watchers_count + b.forks_count + bDescriptionScore;

          return (bScore - aScore)
        })
        .map((entry, index) => {
          return new Promise((resolve, reject) => {
            save(entry, ghUsername, (err, results) => {
              resolve(results);
            });
          })
        })
    })
    .then((arr) => {
      Promise.all(arr)
        .then((finalRepoResults) => {

          finalRepoResults = finalRepoResults.filter(repo => {
            return typeof repo === 'object';
          })

          const foreignKeysArr = finalRepoResults.map((model) => {
            return model._doc._id;
          })
          saveUser(ghUsername, foreignKeysArr, (err) => {
            if (err) {
              console.log(err);
              res.status(200).send('user already exists');
            } else {
              res.status(200).send(finalRepoResults);
            }
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        })

    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/repos', function (req, res) {
  // Returns 25 repos...
  Repo.find({})
    .sort('-score')
    .limit(25)
    .then((results) => {
      return Object.keys(results)
        .reduce((total, key, index, arr) => {
          total.push(results[key]._doc);
          return total;
        }, [])
    })
    .then((finalRepos) => {
      // Returns all users
      User.find({})
        .then((userModels) => {
          let test = [];
          test.push(finalRepos, userModels)
          res.status(200).send(test);
        })
        .catch((err) => {
          res.status(500).send(err);
        })
    });
})

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