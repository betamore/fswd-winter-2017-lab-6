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
    .controller('TasksController', function($http) {
        var vm = this;
        $http.get('/tasks')
            .then(function(response) {
                vm.tasks = response.data;
            })
    });

angular.module('fswd')
    .config(function($routeProvider) {
        $routeProvider.when('/tasks', {
            templateUrl: '/partials/tasks',
            controllerAs: '$ctrl',
            controller: 'TasksController'
        });
        $routeProvider.when('/tasks/:task_id', {
            controller: function($routeParams, $http) {
                var vm = this;
                $http.get('/tasks/' + $routeParams.task_id)
                    .then(function(response) {
                        vm.task = response.data;
                    })
            },
            controllerAs: '$ctrl',
            template: '<h1>TASK {{$ctrl.task.name}}</h1>'
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
