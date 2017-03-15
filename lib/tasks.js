
var express = require('express'),
    router = express.Router();

router.param('task_id', function(request, response, next, task_id) {
    request.app.locals.models.Task.findById(task_id)
        .then(function(task) {
            if (task) {
                request.task = task;
                next();
            } else {
                response.sendStatus(404);
            }
        });
});

// GET localhost:8000/tasks => all the tasks
router.get('/', function(request, response) {
    request.app.locals.models.Task.findAll()
        .then(function(tasks) {
            response.format({
                html: function () {
                    response.render('tasks/tasks', { tasks: tasks });
                },
                json: function() {
                    response.json(tasks);
                }
            })
        });
});

// POST localhost:8000/tasks (w/ task data) => create a new task
router.post('/', function(request, response) {
    request.app.locals.models.Task.create(request.body)
        .then(function(task) {
            request.flash('info', 'Task created successfully!');
            response.redirect(`${request.baseUrl}/${task.id}`);
        });
});

// GET localhost:8000/task/15 => task 15 data
router.get('/:task_id', function(request, response) {
    response.format({
        html: function() {
            response.render('tasks/task', { task: request.task });
        },
        json: function() {
            response.json(request.task);
        }
    });
});

// POST localhost:8000/tasks/15 (w/ data) => update task 15 data
router.post('/:task_id', function(request, response) {
    request.task.update(request.body)
        .then(function(task) {
            response.redirect(`${request.baseUrl}/${task.id}`);
        });
});

router.post('/:task_id/complete', function(request, response) {
    request.task.markCompleted()
        .then(function() {
            response.format({
                html: function() {
                    // request.baseUrl => '/tasks'
                    response.redirect(request.baseUrl); // go to the task list
                },
                json: function() {
                    response.json(request.task);
                }
            })
        });
});

module.exports = router;
