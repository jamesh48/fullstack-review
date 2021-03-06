const express = require('express');
let app = express();
const mongoose = require('mongoose');
require('../database');

const router = require('./routes')

let port = process.env.PORT;

if (port == null || port == "") {
  port = 8000;
}

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
})
app.use('/', router);



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

