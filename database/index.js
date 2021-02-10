const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  author: String,
  repoName: String,
  description: String
});

const Repo = mongoose.model('Repo', repoSchema);

let save = (entry, ghUsername) => {
  const connection = mongoose.connection;
  var repo = new Repo({
    author: ghUsername,
    repoName: entry.name,
    description: entry.description
  })

  repo.save()
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    })

}

module.exports.save = save;
module.exports.Repo = Repo;