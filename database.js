const mongoose = require('mongoose');
const connection = "mongodb+srv://JamesH48:CloudlessSky82@cluster0.nkwrm.mongodb.net/fetcher?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));