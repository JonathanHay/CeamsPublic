var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect('mongodb://dbUser:dbpassw0rd@ds039880.mlab.com:39880/ceams-db', { useNewUrlParser: true });

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('./routes'));

module.exports = app;