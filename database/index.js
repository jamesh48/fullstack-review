const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://JamesH48:CloudlessSky82@cluster0.nkwrm.mongodb.net/fetcher?retryWrites=true&w=majority');

let repoSchema = mongoose.Schema({
  author: String,
  repoName: String,
  description: String,
  url: String,
  score: Number,
  id: Number
});

const Repo = mongoose.model('Repo', repoSchema);

let save = (entry, ghUsername, cb) => {
  const connection = mongoose.connection;
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count;

  Repo.findOne({ 'id': entry.id }, (err, results) => {
    if (err) {
      console.log(err);
      cb(err)
    } else {
      if (results === null) {
        // cb(null, results);
        var repo = new Repo({
          author: ghUsername,
          repoName: entry.name,
          description: entry.description,
          url: entry.html_url,
          score: score,
          id: entry.id
        })
        console.log('saving');
        repo.save((err, results) => {
          if (err) {
            cb(err)
          } else {
            cb(null, results)
          }
        })
      }
    }
  });
}

module.exports.save = save;
module.exports.Repo = Repo;