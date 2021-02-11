const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  author: String,
  repoName: String,
  description: String,
  score: Number
});

const Repo = mongoose.model('Repo', repoSchema);

let save = (entry, ghUsername) => {
  const connection = mongoose.connection;
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count;

  var repo = new Repo({
    author: ghUsername,
    repoName: entry.name,
    description: entry.description,
    score: score
  })

  return repo.save((err, results) => {
    if (err) {
      return 'error'
    } else {
      return results;
    }
  })
    // .then((results) => {
    //   console.log(results);
    // })
    // .catch((err) => {
    //   console.log(err);
    // })

}

module.exports.save = save;
module.exports.Repo = Repo;