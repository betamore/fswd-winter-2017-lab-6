'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    redis = require('connect-redis');

app.locals.models = require('../models');

app.use(cookieParser());
var RedisStore = redis(session);
app.use(session({
  secret: 'Shhhhh!',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore()
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get("/", function(request, response) {
  response.render('index');
});

// app.get('/:name', function(request, response) {
//   response.render('name', { name: request.params.name });
// });

// app.post('/tasks/:task_id', function(request, response) {
//   models.Task.findById(request.params.task_id)
//     .then(function(task) {
//       task.name = request.body.todo;
//       return task.save();
//     }).then(function (task) {
//       request.session.flash_message = "Updated successfully!";
//       redirectToTask(response, task);
//     });
// });

app.use('/tasks', require('./tasks'));

// allow other modules to use the server
module.exports = app;
