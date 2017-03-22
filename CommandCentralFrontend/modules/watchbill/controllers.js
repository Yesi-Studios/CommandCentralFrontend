'use strict';

angular.module('Watchbill')

    .controller('WatchbillController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            }]
    )
    .directive('ngWatchBillNub', function () {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    watchbillId: '@'
                },
                templateUrl: "modules/watchbill/directives/watchbillnub.html",
                controller: ['$scope', '$location', 'WatchbillService', 'ConnectionService', function ($scope, $location, WatchbillService, ConnectionService) {
                    WatchbillService.LoadWatchbill($scope.watchbillId,
                        function (response) {
                            $scope.watchbill = response;
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                }]
            }
        }
    );
