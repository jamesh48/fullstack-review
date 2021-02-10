const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  username: String,
  description: String
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (/* TODO */) => {
  const connection = mongoose.connection;
  var repo = new Repo({
    username: 'James',
    description: 'Is Awesome'
  })

  repo.save()
    .then((results) => {
      console.log('james is awesome');
    })
    .catch((err) => {
      console.log(err);
    })

}

module.exports = save;