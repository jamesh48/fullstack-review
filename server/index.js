const express = require('express');
let app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGODB_URI;
const mongoose = require('mongoose');
require('../database');
// mongoose.connect('mongodb://localhost/fetcher');
// mongoose.connect(url || 'mongodb://localhost/fetcher')
const router = require('./routes')
// app.use(cors())
app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
})
app.use('/', router);

let port = process.env.PORT;

if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

