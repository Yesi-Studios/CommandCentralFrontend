'use strict';

angular.module('Connection')

.controller('SetPortController',
    ['$scope', '$rootScope', 'ConnectionService', 'config',
        function ($scope, $rootScope, ConnectionService, config) {
            $scope.setPort = function (thePort) { ConnectionService.SetBackendPort(thePort); $scope.currentURL = $scope.getCurrentUrl() };
            $scope.getCurrentUrl = function () { return ConnectionService.GetBackendURL(); };
            $scope.currentURL = $scope.getCurrentUrl();
            $scope.showPortController = config.debugMode;
        }]);