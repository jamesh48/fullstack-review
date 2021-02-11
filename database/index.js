const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// const url = process.env.MONGODB_URI;

// mongoose.connect(url);

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
  console.log('before connection');
  const connection = mongoose.connection;
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count;
  console.log('before repo.findOne')
  // Repo.findOne({ 'id': entry.id }, (err, results) => {
  //   console.log('inside Find One')
  //   if (err) {
  //     console.log(err);
  //     cb(err)
  //   } else {
  //     if (results === null) {
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
//     }
//   });
// }

module.exports.save = save;
module.exports.Repo = Repo;