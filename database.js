const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const url = process.env.MONGODB_URI;

const connection = url;
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
