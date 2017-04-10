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
                controller: ['$scope', '$location', '$route', 'WatchbillService', 'ConnectionService', function ($scope, $location, $route, WatchbillService, ConnectionService) {
                    $scope.go = function(path) {
                        $location.path(path);
                    };

                    $scope.deleteWatchbill = function(id) {
                        WatchbillService.DeleteWatchbill(id,
                            function (response) {
                                $route.reload();
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            });
                    }
                    WatchbillService.LoadWatchbill($scope.watchbillId,
                        function (response) {
                            $scope.watchbill = response.ReturnValue;
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
                },
                templateUrl: "modules/watchbill/directives/watchbillcreator.html",
                controller: ['$scope', '$location', 'WatchbillService', 'ConnectionService', function ($scope, $location, WatchbillService, ConnectionService) {


                    $scope.createNewWatchBill = function () {
                        WatchbillService.CreateWatchbill($scope.title, $scope.group,
                            function (response) {
                                var watchbillId = response.ReturnValue.Id
                                var days = [];

                                for (var j = 0; j < $scope.numberOfDays; j += 1) {
                                    days[j] = {
                                        'date': new Date($scope.from),
                                        'remarks': '',
                                        'watchbill': {'Id': watchbillId}
                                    };
                                    days[j].date.setDate(days[j].date.getDate() + j);
                                }
                                WatchbillService.CreateWatchDays(days, function (response) {
                                        $location.path("/watchbill/edit/" + watchbillId);
                                    },
                                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                    function (response) {
                                        ConnectionService.HandleServiceError(response, $scope, $location);
                                    }
                                );
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );
                    }
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
    ).directive('ngShiftNub', function () {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '='
            },
            templateUrl: "modules/watchbill/directives/shiftnub.html",
            controller: ['$scope', '$location', '$filter', 'WatchbillService', 'ConnectionService', function ($scope, $location, $filter, WatchbillService, ConnectionService) {
                $scope.ngModel.Range.Start = new Date($scope.ngModel.Range.Start);
                $scope.ngModel.Range.End = new Date($scope.ngModel.Range.End);
            }]
        }
    }
)
    .directive('ngDayEditor', function () {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
            },
            templateUrl: "modules/watchbill/directives/dayeditor.html",
            controller: ['$scope', '$location', '$filter', 'WatchbillService', 'ConnectionService', function ($scope, $location, $filter, WatchbillService, ConnectionService) {
                WatchbillService.GetAllLists(function (response) {
                        $scope.shiftTypes = response.ReturnValue.WatchShiftType;
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    });
            }]
        }
    });