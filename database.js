const mongoose = require('mongoose');
const connection = "mongodb://JamesH48:CloudlessSky82@cluster0-shard-00-00.nkwrm.mongodb.net:27017,cluster0-shard-00-01.nkwrm.mongodb.net:27017,cluster0-shard-00-02.nkwrm.mongodb.net:27017/fetcher?ssl=true&replicaSet=atlas-tmpem3-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
