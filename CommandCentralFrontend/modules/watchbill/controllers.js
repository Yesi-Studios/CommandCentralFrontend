'use strict';

angular.module('Watchbill')

    .controller('WatchbillController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
                WatchbillService.LoadWatchbills(
                    function (response) {
                        $scope.watchbills = response.ReturnValue;
                        console.log(response);
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                )
            }]
    );
