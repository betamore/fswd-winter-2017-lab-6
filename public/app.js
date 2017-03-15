require('bootstrap');
require('bootstrap/css/bootstrap.css!');
require('bootstrap/css/bootstrap-theme.css!');

var $ = require('jquery');
// window.$ = $;

$('body').show();

var angular = require('angular');
require('angular-route');

angular.module('fswd', ['ngRoute']);

angular.module('fswd')
    .controller('TasksController', function(TasksService) {
        var vm = this;
        TasksService.getTasks()
            .then(function(tasks) {
                vm.tasks = tasks;
            });
    });

angular.module('fswd')
    .service('TasksService', function($http) {
        this.getTask = function(task_id) {
            return $http.get('/tasks/' + task_id)
                .then(function(response) {
                    return response.data;
                });
        };

        this.getTasks = function() {
            return $http.get('/tasks')
                .then(function(response) {
                    return response.data;
                });
        };
    });

angular.module('fswd')
    .config(function($routeProvider) {
        $routeProvider.when('/tasks', {
            templateUrl: '/partials/tasks',
            controllerAs: '$ctrl',
            controller: 'TasksController'
        });
        $routeProvider.when('/tasks/:task_id', {
            controller: function(task) {
                var vm = this;
                vm.task = task;
            },
            controllerAs: '$ctrl',
            template: '<h1>TASK {{$ctrl.task.name}}</h1>',
            resolve: {
                task: function(TasksService, $route) {
                    return TasksService.getTask($route.current.params.task_id);
                }
            }
        });

        $routeProvider.otherwise('/tasks');
    });

angular.module('fswd')
    .run(function($rootScope) {
        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
            alert('Task not found!');
        });
    });

angular.module('fswd')
    .controller('CounterController', function(CounterService) {
        var count;
        this.addCount = function() {
            count += 1;
        };

        this.getCount = function() {
            return count;
        };

        this.$onInit = function() {
            CounterService.addCounter();
            count = (this.initialValue && this.initialValue.counter) || 0;
        };
    });
angular.module('fswd')
    .controller('CounterCountController', function(CounterService) {
        this.getCount = function() {
            return CounterService.getCounter();
        };
    });

angular.module('fswd')
    .service('CounterService', function($log) {
        var counterCount = 0;

        this.addCounter = function() {
            counterCount += 1;
            $log.info("There are now " + counterCount + " counters");
        };

        this.getCounter = function() {
            return counterCount;
        };
    });

angular.module('fswd')
    .component('counterBlockComponent', {
        templateUrl: '/partials/counterBlock',
        controller: 'CounterController',
        bindings: {
            initialValue: '<'
        }
    });

angular.module('fswd')
    .controller('RegistrationController', function($scope) {
        var vm = this;

        $scope.$watch(function() {
            return [vm.password, vm.password_confirm];
        }, function(newVal) {
            if (newVal) {
              var valid = vm.password === vm.password_confirm;
              $scope.registration.$setValidity("matched", valid);
            }
        }, true);
    });

angular.module('fswd')
    .directive('uniqueUsername', function($http) {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function(scope, element, attrs, ctrl) {
                ctrl.$asyncValidators.uniqueUsername = function(modelValue) {
                    console.log('Validating: "' + modelValue + '"');
                    return $http.post('/users/available', { username: modelValue });
                };
            }
        };
    });

angular.element(function() {
    console.log('Bootstrapping!');
    angular.bootstrap(document, ['fswd'])
});
