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
                    $scope.go = function (path) {
                        $location.path(path);
                    };

                    $scope.deleteWatchbill = function (id) {
                        WatchbillService.DeleteWatchbill(id,
                            function (response) {
                                $route.reload();
                            }, ConnectionService.HandleServiceError($scope, $location));
                    };

                    $scope.watchbill = $scope.ngModel;
                    // WatchbillService.LoadWatchbill($scope.watchbillId,
                    //     function (response) {
                    //         $scope.watchbill = response.ReturnValue;
                    //     }, ConnectionService.HandleServiceError($scope, $location));
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
                        }, ConnectionService.HandleServiceError($scope, $location));
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
                        WatchbillService.CreateWatchbill($scope.title, $scope.group, $scope.from, $scope.to,
                            function (response) {
                                $location.path("/watchbill/edit/" + response.ReturnValue.Id);
                            }, ConnectionService.HandleServiceError($scope, $location));
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
                        }, ConnectionService.HandleServiceError($scope, $location));
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
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

                $scope.days = Math.round(Math.abs(($scope.ngModel.Range.Start.getTime() - $scope.ngModel.Range.End.getTime()) / (oneDay)))

                $scope.daysText = function () {
                    if ($scope.days) {
                        var days = $scope.days;
                        return "(" + days + " days)";
                    } else {
                        return "";
                    }
                }
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
                $scope.removeSelectedShift = function () {
                    $scope.ngModel.splice($scope.ngModel.indexOf($scope.selectedShift), 1);
                    $scope.selectedShift = $scope.ngModel[$scope.ngModel.length - 1];
                };
                WatchbillService.GetAllLists(function (response) {
                    $scope.shiftTypes = response.ReturnValue.WatchShiftType;
                }, ConnectionService.HandleServiceError($scope, $location));
                $scope.$watch('ngModel', function (newValue, oldValue) {
                    if (!$scope.selectedShift && $scope.ngModel) {
                        $scope.selectedShift = $scope.ngModel[0];
                    }
                })
            }]
        }
    })
    .directive('ngAssignmentEditor', function () {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                ngPeople: '='
            },
            templateUrl: "modules/watchbill/directives/assignmenteditor.html",
            controller: ['$scope', '$location', '$filter', 'WatchbillService', 'ConnectionService', function ($scope, $location, $filter, WatchbillService, ConnectionService) {
                $scope.log = function (thing) {
                    console.log(thing);
                };
                $scope.assignWatchstander = function (stander, shift) {
                    shift.WatchAssignment = {'PersonAssigned': stander, 'WatchShift': {'Id': shift.Id}};
                };
            }]
        }
    });
