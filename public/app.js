require('bootstrap');
require('bootstrap/css/bootstrap.css!');
require('bootstrap/css/bootstrap-theme.css!');

var $ = require('jquery');
window.$ = $;

$('body').show();

var angular = require('angular');

angular.module('fswd', []);
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
    .service('CounterService', function($log, $http) {
        var counterCount = 0;

        this.addCounter = function() {
            counterCount += 1;
            $log.info("There are now " + counterCount + " counters");
        };

        this.getCounter = function() {
            return counterCount;
        };

        this.getTasks = function() {
            return $http.get('/tasks')
        }
    });

angular.module('fswd')
    .component('counterBlockComponent', {
        templateUrl: '/partials/counterBlock',
        controller: 'CounterController',
        bindings: {
            initialValue: '<'
        }
    });

angular.bootstrap(document, ['fswd']);
