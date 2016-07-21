'use strict';

angular.module('Connection')

.controller('SetPortController',
    ['$scope', '$rootScope', 'ConnectionService',
        function ($scope, $rootScope, ConnectionService) {
            $scope.setPort = function (thePort) { ConnectionService.SetBackendPort(thePort); $scope.currentURL = $scope.getCurrentUrl() };
            $scope.getCurrentUrl = function () { return ConnectionService.GetBackendURL(); };
            $scope.currentURL = $scope.getCurrentUrl();
        }]);