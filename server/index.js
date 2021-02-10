const express = require('express');
let app = express();
const axios = require('axios');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');
const save = require('../database/index.js')
app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use('/', (req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
})
app.post('/repos', function (req, res) {
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
      save()
      // console.log(results);
    })
    .catch((err) => {
      console.log(err);
    })

  // save the repo information in the database
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

app.get('/dropCollections', (req, res) => {
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

let port = 1128;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

