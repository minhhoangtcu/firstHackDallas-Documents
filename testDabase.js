var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/userSchema.js');

var config = require('./config.json');

// connect to database
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database");
});



var app = express();

app.use(bodyParser.json());

app.post('/testDB', (req, res) => {
    var data = req.body;
    addUser(data).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

app.post('/updateUser', (req, res) => {
    var data = req.body;
    updateUser(data).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

function addUser(data) {
    return new Promise(function (resolve, reject) {
        User.create(data, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function updateUser(data) {
    return new Promise(function (resolve, reject) {
        User.update({OauthToken: data.OauthToken}, data, (error) => {
            if (error) return reject(error);
            else return resolve('update all field');
        });
    });
}

app.listen(8080);