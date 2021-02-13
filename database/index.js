const mongoose = require('mongoose');
const axios = require('axios');

const contributorSchema = mongoose.Schema({
  contributor: String,
  name: String,
  avatar: String,
  bio: String,
  url: String,
})

const Contributor = mongoose.model('Contributor', contributorSchema);

const userSchema = mongoose.Schema({
  user: String,
  repos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repo', other: {} }]
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

const saveUser = async (ghUsername, foreignKeysArr) => {
  const userResults = await User.findOne({ user: ghUsername });
  if (userResults === null) {
    let user = new User({ user: ghUsername });
    foreignKeysArr.forEach((fk) => {
      user.repos.push(fk);
    })
    user.save();
    return;
  }
}

const saveContributors = async (contributor, ghUsername, cb) => {
  const newContributor = new Contributor({
    contributor: contributor.login,
    url: contributor.url,
    bio: contributor.bio,
    name: contributor.name,
    avatar: contributor.avatar_url
  })

  await newContributor.save();
  return newContributor;
}

const getContributors = async (entry, ghUsername) => {
  const config = {
    method: 'GET',
    url: entry.contributors_url
  }

  let contributorsArr = await axios(config);
  contributorsArr = contributorsArr.data.map(contributor => {
    // if (contributor.login !== ghUsername) {
      const json = new Object();
      // json.name = contributor.name;
      json.login = contributor.login;
      json.url = contributor.html_url;
      // json.avatar = contributor.avatar_url;
      // json.bio = contributor.bio;

      return new Promise(async (resolve, reject) => {
        const result = await (saveContributors(json, ghUsername));
        resolve(result)
      })
    // }
  })
  contributorsArr = await Promise.all(contributorsArr)
  console.log('resolved contributors array')
  console.log(contributorsArr.length)
  return contributorsArr;
}

const saveRepos = async (entry, ghUsername, cb) => {
  // Repos are already sorted at this point, adding up the score again is just for the model's score property.
  // entryDescriptionScore helps to manage tie breaks if both repos have no points but one has a description, it prevails.
  const entryDescriptionScore = entry.description ? 1 : 0
  const score = entry.stargazers_count + entry.watchers_count + entry.forks_count + entryDescriptionScore

  const existingRepoResults = await Repo.findOne({ 'id': entry.id });

  if (existingRepoResults === null) {
    const contributorResults = await getContributors(entry, ghUsername);

    let newRepo = new Repo({
      author: ghUsername,
      repoName: entry.name,
      description: entry.description || '',
      url: entry.html_url,
      score: score,
      id: entry.id
    })

    contributorResults.forEach((contributor) => {
      // console.log(contributor);
      newRepo.publicContributors.push(contributor._doc);
      newRepo.contributors.push(contributor._doc._id);
    })

    await newRepo.save()
    return newRepo;
  }
}

module.exports.saveRepos = saveRepos;
module.exports.saveUser = saveUser;
module.exports.Repo = Repo;
module.exports.User = User;

// module.exports.Contributor = Contributor;