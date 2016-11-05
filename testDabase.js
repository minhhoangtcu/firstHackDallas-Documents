var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/userSchema');
var Service = require('./models/serviceSchema');
var calculator = require('./calculateDistance');

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

app.get('/getService', (req, res) => {
    var query = req.headers;
    getService(query).then(function(response) {
        var result = Promise.all(response.map((service, index, array) => {
            return calculator.calculateDistance(service.location).then(distance => {
                service['distance'] = distance;
                return service;
            }, error => {
                return error;
            });
        }));
        result.then(data => {
            console.log(data[0]);
        });
        res.json(result);
    }, function(error) {
        res.json(error);
    });
});

app.post('/addService', (req, res) => {
    var data = req.body;
    addService(data).then(function(response) {
        res.json(response);
    }, function(error) {
        res.json(error);
    });
});

function getService(query) {
    return new Promise(function(resolve, reject) {
        Service.find({}, function(err, data) {
            if (err) return reject(err);
            else return resolve(data);
        });
    });
}

function addService(data) {
    return new Promise(function (resolve, reject) {
        Service.create(data, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

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