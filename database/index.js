const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  username: String,
  description: String
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (userName) => {
  const connection = mongoose.connection;
  var repo = new Repo({
    username: userName,
    description: 'Is Awesome'
  })

  repo.save()
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    })

}

module.exports = save;