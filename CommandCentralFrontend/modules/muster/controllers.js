'use strict';

angular.module('Muster')

.controller('MusterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService) {

        // This scope will just about always contain PII
        $rootScope.containsPII = true;

        // The default sorting key
        $scope.orderKey = "LastName";

        // Give our scope a way to sort
        $scope.setOrder = function (theKey) {
            if ($scope.orderKey == theKey) {
                $scope.orderKey = "-" + theKey;
            } else {
                $scope.orderKey = theKey;
            }
        }
    }
    ]);