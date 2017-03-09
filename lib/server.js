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
app.set('view options', { pretty: true });

if (process.env.NODE_ENV === 'development') {
    app.locals.pretty = true;
}

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

app.get('/partials/:template_id', function(req, res) {
  res.render('partials/' + req.params.template_id);
});

app.get('/register', function(req, res) {
    res.render('users/register');
})

// allow other modules to use the server
module.exports = app;
