const mongoose = require('mongoose');
const axios = require('axios');

const contributorSchema = mongoose.Schema({
  handle: String,
  url: String
})

const Contributor = mongoose.model('Contributor', contributorSchema);

const userSchema = mongoose.Schema({
  user: String,
  friendsList: [],
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
  publicContributors: [],
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contributor' }]
});

const Repo = mongoose.model('Repo', repoSchema);

const saveUser = async (ghUsername, foreignKeysArr, friendsList) => {
  const userResults = await User.findOne({ user: ghUsername });
  if (userResults === null) {
    let user = new User({ user: ghUsername });
    foreignKeysArr.forEach((fk) => {
      user.repos.push(fk);
    })
    user.friendsList = friendsList;
    await user.save();
    return;
  }
}

const saveContributors = async (contributor) => {
  const potentialContributor = await Contributor.findOne({ 'handle': contributor.login })

  const newContributor = new Contributor({
    handle: contributor.login,
    url: contributor.html_url,
  })

  if (potentialContributor === null) {
    const passingContributor = await newContributor.save();
    return passingContributor;
  } else {
    // Don't save but return contributor to be listed in repo
    return newContributor;
  }
}

const getContributors = async (entry) => {
  const config = {
    method: 'GET',
    url: entry.contributors_url
  }

  let contributorsArr = await axios(config);

  // return Promise.all(contributorsArr.data.map(
  //   (contributor) => {
  //       // return saveContributors(contributor);
  //     }
  //   }))
  return contributorsArr.data.reduce(async (total, contributor) => {
    const results = await total;
    let passing = await saveContributors(contributor);
    if (!passing) {
      return [...results]
    } else {
      return [...results, passing];
    }
  }, [])
}

const saveRepos = async (entry, ghUsername) => {
  // Repos are already sorted at this point, adding up the score again is just for the model's score property.
  // entryDescriptionScore helps to manage tie breaks if both repos have no points but one has a description, it prevails.
  const entryDescriptionScore = entry.description ? 1 : 0
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count + entryDescriptionScore

  const existingRepoResults = await Repo.findOne({ 'id': entry.id });

  if (existingRepoResults === null) {
    const contributorResults = await getContributors(entry);
    // contributorResults.forEach((contributor) => {
    //   console.log(contributor.handle)
    // })
    // console.log(contributorResults);
    let newRepo = new Repo({
      author: ghUsername,
      repoName: entry.name,
      description: entry.description || '',
      url: entry.html_url,
      score: score,
      id: entry.id
    })

    contributorResults.forEach((contributor) => {
      if (typeof contributor === 'object') {
        newRepo.publicContributors.push(contributor._doc);
        newRepo.contributors.push(contributor._doc._id);
      }
    })

    // console.log(contributorResults);
    // console.log(typeof contributorResults);

    await newRepo.save()
    //  var arr = [];
    //  arr.push(newRepo, contributorResults)
    return newRepo;
    // return arr;
  }
}

module.exports.saveRepos = saveRepos;
module.exports.saveUser = saveUser;
module.exports.Repo = Repo;
module.exports.User = User;

// module.exports.Contributor = Contributor;