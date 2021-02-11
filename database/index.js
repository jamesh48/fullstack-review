const mongoose = require('mongoose');
const axios = require('axios');

// const contributorSchema = mongoose.Schema({
//   contributor: String
// })

// const Contributor = mongoose.model('Contributor', contributorSchema);

const repoSchema = mongoose.Schema({
  author: String,
  repoName: String,
  description: String,
  url: String,
  score: Number,
  id: Number,
  // contributors: []
});

const Repo = mongoose.model('Repo', repoSchema);

const save = (entry, ghUsername, cb) => {
  const connection = mongoose.connection;
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count;
  Repo.findOne({ 'id': entry.id }, (err, results) => {
    if (err) {
      console.log(err);
      cb(err)
    } else {
      if (results === null) {
            var repo = new Repo({
              author: ghUsername,
              repoName: entry.name,
              description: entry.description,
              url: entry.html_url,
              score: score,
              id: entry.id,
            })
            repo.save((err, results) => {
              if (err) {
                cb(err)
              } else {
                cb(null, results)
              }
            })
      } else {
        console.log('cancelling!');
        cb(null, '_empty');
      }
    }
  });
}

module.exports.save = save;
module.exports.Repo = Repo;
// module.exports.Contributor = Contributor;