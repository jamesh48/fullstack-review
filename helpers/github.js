const axios = require('axios');
const config = require('../config.js');

const clientId = 'b7dd0005a4ad3833eada';
const clientSecret = '08ab6590c23fcd1c45fc4ca8372b374b585ea65f';

let getReposByUsername = (ghUsername) => {
  const options = {
    method: 'GET',
    url: `https://api.github.com/users/${ghUsername}/repos`,
    headers: {
      'Authorization': `token ${config.TOKEN}`
    }
  };
  return options;
}

module.exports.getReposByUsername = getReposByUsername;