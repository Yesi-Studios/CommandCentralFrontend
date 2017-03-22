'use strict';

angular.module('Watchbill')

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
    )
    .directive('ngWatchBill', function () {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    watchbillId: '@'
                },
                templateUrl: "modules/watchbill/directives/watchbill.html",
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
    )
    .directive('ngWatchBillCreator', function () {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    watchbillId: '@'
                },
                templateUrl: "modules/watchbill/directives/watchbillcreator.html",
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
    )
    .directive('ngWatchBillEditor', function () {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    watchbillId: '@'
                },
                templateUrl: "modules/watchbill/directives/watchbilleditor.html",
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
