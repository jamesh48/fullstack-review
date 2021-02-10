const express = require('express');
const router = express.Router();
const axios = require('axios');
const save = require('../database/index.js')

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
      console.log(results.length);
      save(ghUsername)
      // console.log(results);
    })
    .catch((err) => {
      console.log(err);
    })

  // save the repo information in the database
});

router.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

router.get('/dropCollections', (req, res) => {
  const connection = mongoose.connection;
  connection.db.listCollections().toArray((err, names) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < names.length; i++) {
        console.log(names[i].name)
        mongoose.connection.db.dropCollection(names[i].name, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(names[i].name + ' Dropped!');
          }
        })
      }
    }
  })
})


module.exports = router;