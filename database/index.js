const mongoose = require('mongoose');
const axios = require('axios');



const userSchema = mongoose.Schema({
  user: String,
  repos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repo' }]
})

const User = mongoose.model('User', userSchema);


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

//Todo: create user save

const saveUser = (ghUsername, foreignKeysArr, cb) => {

  User.findOne({ user: ghUsername }, (err, userResults) => {
    if (err) {
      console.log(err);
      cb('error');
    } else {
      if (userResults === null) {
        var user = new User({
          user: ghUsername,
        })
        foreignKeysArr.forEach((fk) => {
          user.repos.push(fk);
        })
        user.save((err, results) => {
          if (err) {
            cb('error')
          } else {
            // Success Case
            cb(null);
          }
        })
      } else {
        console.log('cancelling adding user!')
        cb('error')
      }
    }
  })

}

const save = (entry, ghUsername, cb) => {
  // const connection = mongoose.connection;
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
          description: entry.description || '',
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
module.exports.saveUser = saveUser;
module.exports.Repo = Repo;
module.exports.User = User;

// module.exports.Contributor = Contributor;