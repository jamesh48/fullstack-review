const axios = require('axios');
const config = require('../config.js');

let getReposByUsername = (ghUsername) => {
  let options = {
    method: 'GET',
    url: `https://api.github.com/users/${ghUsername}/repos`,
    headers: {
      'Authorization': `token ${config.TOKEN}`
    }
  };
  return options;
}

module.exports.getReposByUsername = getReposByUsername;