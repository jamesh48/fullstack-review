const mongoose = require('mongoose');
const axios = require('axios');


const contributorSchema = mongoose.Schema({
  contributor: String
})

const Contributor = mongoose.model('Contributor', contributorSchema);

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
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contributor' }]
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

const saveContributors = (contributor, ghUsername, cb) => {
  var contributor = new Contributor({
    contributor: contributor.login
  })

  contributor.save((err, results) => {
    if (err) {
      cb(err);
    } else {
      cb(null, results);
    }
  })
}

const getContributors = (entry, ghUsername, cb) => {
  var config = {
    method: 'GET',
    url: entry.contributors_url
  }

  return axios(config)
    .then((contributorsArr, ghUsername) => {
      return contributorsArr.data.map(contributor => {
        if (contributor.login !== ghUsername) {
          const json = new Object();
          json.login = contributor.login;
          json.url = contributor.url;
          return json;
        }
      })
    })
    .then((allCurrentContributors) => {
      return allCurrentContributors.map((contributor) => {
        return new Promise((resolve, reject) => {
          saveContributors(contributor, ghUsername, (err, results) => {
            resolve(results)
          })
        })
      })
    })
    .then((promiseArr) => {
      Promise.all(promiseArr)
        .then((finalContributorResults) => {
          // console.log(finalContributorResults)
          cb(null, finalContributorResults);
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err);
    })
}

const save = (entry, ghUsername, cb) => {
  // Repos are already sorted at this point, adding up the score again is just for the model's score property.
  // entryDescriptionScore helps to manage tie breaks if both repos have no points but one has a description, it prevails.
  const entryDescriptionScore = entry.description ? 1 : 0
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count + entryDescriptionScore
  Repo.findOne({ 'id': entry.id }, (err, results) => {
    if (err) {
      console.log(err);
      cb(err)
    } else {
      if (results === null) {
        getContributors(entry, ghUsername, (err, contributorResults) => {
          var repo = new Repo({
            author: ghUsername,
            repoName: entry.name,
            description: entry.description || '',
            url: entry.html_url,
            score: score,
            id: entry.id,
          })

          // save contributor foreign keys to repo
          contributorResults.forEach((contributor) => {
            repo.contributors.push(contributor._doc._id);
          })

          repo.save((err, results) => {
            if (err) {
              cb(err)
            } else {
              cb(null, results)
            }
          })
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