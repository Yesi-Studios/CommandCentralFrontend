'use strict';
 
angular.module('Connection')

.factory('ConnectionService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout',
    function (Base64, $http, $localStorage, $rootScope, $timeout) {
        var service = {};

        return service;
    }]);