const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const save = require('../database/index.js').save
const Repo = require('../database/index.js').Repo;

router.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  var ghUsername = req.body.term;
  // and get the repo information from the github API, then
  const config = {
    method: 'GET',
    url: `https://api.github.com/users/${ghUsername}/repos`
  }

  return axios(config)
    .then((results) => {
      results.data.forEach(entry => {
        save(entry, ghUsername);
      })
    })
    .then(() => {
      res.status(200).send('success');
    })
    .catch((err) => {
      console.log(err);
    })

  // save the repo information in the database
});

router.get('/repos', function (req, res) {
  console.log('hello')
  // TODO - your code here!
  // This route should send back the top 25 repos
  const connection = mongoose.connection;
  Repo.find({})
    .sort('-score')
    .limit(25)
    .then((results) => {
      results.forEach(result => {
        console.log(result.score);
      })
      res.status(200).send(results);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
});

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