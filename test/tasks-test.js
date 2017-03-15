require('./setup');

var server = require('../lib/server'),
    supertest = require('supertest'),
    models = require('../models'),
    cheerio = require('cheerio'),
    _ = require('lodash');

describe('tasks', function() {
    var agent;
    beforeEach(function() {
        agent = supertest.agent(server);
    });

    // after(function() {
    //     return models.Task.truncate();
    // })

    it('should 404 for an unknown task', function() {
        return agent
            .get('/tasks/999')
            .expect(404);
    });

    describe('when there are no tasks', function() {
        it('should display no tasks for the task list', function() {
            return agent
                .get('/tasks')
                .expect(/No tasks/);
        });
    });

    describe('adding a task', function() {
        it('should redirect to the new task page', function() {
            return agent
                .post('/tasks')
                .type('form')
                .send({ name: 'Added task' })
                .expect(302)
                .expect('Location', /\/tasks\/\d+/)
                .then(function(response) {
                    return agent
                        .get(response.header.location)
                        .expect(200, /Added task/);
                });
        });
    });

    describe('updating a task', function() {
        var task;
        before(function() {
            return models.Task.create({ name: 'Task to update' })
                .then(function(_task_) {
                    task = _task_;
                });
        });

        it('should update a task on POST', function() {
            return agent
                .post(`/tasks/${task.id}`)
                .type('form')
                .send({ name: 'Updated task' })
                .expect(302)
                .expect('Location', `/tasks/${task.id}`)
                .then(function(response) {
                    return agent
                        .get(response.header.location)
                        .expect(/Updated task/)
                });
        });

        it('should complete a task on POST', function() {
            return agent
                .post(`/tasks/${task.id}/complete`)
                .expect(302)
                .expect('Location', '/tasks')
                .then(function() {
                    return task.reload();
                })
                .then(function(updatedTask) {
                    updatedTask.isCompleted().should.be.true;
                });
        });
    })

    describe('when there are tasks', function() {
        var tasks;
        before(function() {
            return models.Task.bulkCreate([
                { name: 'Test task'  },
                { name: 'Other task', completedAt: new Date() }
            ], { returning: true })
                .then(function() {
                    return models.Task.findAll();
                })
                .then(function(_tasks_) {
                    tasks = _.takeRight(_tasks_, 2);
                });
        });

        it('should display the tasks in the task list', function() {
            return agent
                .get('/tasks')
                .expect(/Test task/)
                .expect(/Other task/);
        });

        it('should have a page for the each task', function() {
            return agent
                .get(`/tasks/${tasks[0].id}`)
                .expect(/Test task/)
                .then(function() {
                    return agent
                        .get(`/tasks/${tasks[1].id}`)
                        .expect(/Other task/);
                });
        });

        describe('when it is uncompleted', function() {
            it('should not display a checkmark', function() {
                return agent
                    .get(`/tasks`)
                    .then(function(response) {
                        var $ = cheerio.load(response.text);
                        $(`li a[href='/tasks/${tasks[0].id}'] span.glyphicon-ok`).length.should.equal(0);
                    });
            });
        });

        describe('when it is completed', function() {
            it('should display a checkbox', function() {
                return agent
                    .get(`/tasks`)
                    .then(function(response) {
                        var $ = cheerio.load(response.text);
                        $(`li a[href='/tasks/${tasks[1].id}'] span.glyphicon-ok`).length.should.equal(1);
                    });
            });
        });
    })
});
