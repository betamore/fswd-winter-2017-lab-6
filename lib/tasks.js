
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

router.get('/', function(request, response) {
    request.app.locals.models.Task.findAll()
        .then(function(tasks) {
            response.render('tasks/tasks', { tasks: tasks });
        });
});

router.post('/', function(request, response) {
    request.app.locals.models.Task.create(request.body)
        .then(function(task) {
            request.flash('info', 'Task created successfully!');
            response.redirect(`${request.baseUrl}/${task.id}`);
        });
});

router.get('/:task_id', function(request, response) {
    response.render('tasks/task', { task: request.task });
});

router.post('/:task_id', function(request, response) {
    request.task.update(request.body)
        .then(function(task) {
            response.redirect(`${request.baseUrl}/${task.id}`);
        });
});

router.post('/:task_id/complete', function(request, response) {
    request.task.markCompleted()
        .then(function() {
            response.redirect(request.baseUrl); // go to the task list
        });
});

module.exports = router;
