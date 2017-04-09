'use strict';

angular.module('Watchbill')

    .controller('WatchbillsController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
                WatchbillService.LoadWatchbills(
                    function (response) {
                        $scope.watchbills = response.ReturnValue;
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                )
            }]
    ).controller('WatchbillController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
            WatchbillService.LoadWatchbill($routeParams.id,
                function (response) {
                    $scope.watchbill = response.ReturnValue;
                    $scope.weeks = [];

                    // Fix our dates to be Dates
                    angular.forEach(response.ReturnValue.WatchDays, function (value, index) {
                        $scope.watchbill.WatchDays[index].Date = new Date(value.Date);
                    });

                    // Sort our dates because Atwood is an ass
                    $scope.watchbill.WatchDays = $filter('orderBy')($scope.watchbill.WatchDays, 'Date');

                    // This is how much we have to adjust the start of the week in the calendar
                    var pushAmount = (new Date($scope.watchbill.WatchDays[0].Date)).getDay();

                    // Create an array of the weeks populated with the days
                    angular.forEach(response.ReturnValue.WatchDays, function (value, index) {
                        if (!$scope.weeks[Math.floor((pushAmount + index) / 7)]) {
                            $scope.weeks[Math.floor((pushAmount + index) / 7)] = [];
                        }
                        $scope.weeks[Math.floor((pushAmount + index) / 7)].push($scope.watchbill.WatchDays[index]);
                    });

                    $scope.blankStartDays = new Array(pushAmount);
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            )
        }]
).controller('WatchbillEditorController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
            $scope.copyShifts = function (shifts, day) {
                day.WatchShifts = [];
                /**
                 * @param {Date} value
                 */
                angular.forEach(shifts, function (value, index) {
                    var fixed = angular.copy(value);
                    fixed.Range.Start = new Date(fixed.Range.Start);
                    fixed.Range.End = new Date(fixed.Range.End);
                    fixed.Range.Start.setDate(day.Date.getDate());
                    fixed.Range.Start.setMonth(day.Date.getMonth());
                    fixed.Range.Start.setYear(day.Date.getYear());
                    fixed.Range.End.setDate(day.Date.getDate());
                    fixed.Range.End.setMonth(day.Date.getMonth());
                    fixed.Range.End.setYear(day.Date.getYear());
                    console.log(value);
                    console.log(fixed);
                    day.WatchShifts.push(fixed);
                })
            };

            $scope.copyDay = function (day) {
                console.log($scope.dayToCopy);
                console.log(day);
                $scope.dayToCopy = day.WatchShifts;
            };

            $scope.saveWatchBill = function () {
                var newDays = [];
                var newShifts = [];

                for (var d in $scope.watchbill.WatchDays){
                    for (var s in $scope.watchbill.WatchDays[d].WatchShifts){
                        newShifts.push($scope.watchbill.WatchDays[d].WatchShifts[s]);
                    }
                }

                // First, delete all the watch days in the backend
                WatchbillService.DeleteWatchDays($scope.watchbill.WatchDays, function (response) {
                        console.log(response)
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    })
                    // Then, create all those days again, saving their Ids
                    .then(function () {
                        WatchbillService.CreateWatchDays($scope.watchbill.WatchDays, function (response) {
                                newDays = response.ReturnValue;
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            });
                    })
                    .then(function(){
                        WatchbillService.CreateWatchShifts(newShifts, $scope.watchbill.Id, function (response) {
                                console.log(response)
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            });
                    });

                // Then create all the watch shifts, sending the days we just created as the list of days.

                // angular.forEach($scope.watchbill.WatchDays, function (value, index) {
                //     var dayId = value.Id;
                //     WatchbillService.DeleteWatchDay(value.id, function (response) {
                //             console.log(response)
                //         },
                //         // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                //         function (response) {
                //             ConnectionService.HandleServiceError(response, $scope, $location);
                //         }).then(function () {
                //         WatchbillService.CreateWatchDay(value, function (response) {
                //                 console.log(response);
                //                 dayId = response.ReturnValue.Id;
                //             },
                //             // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                //             function (response) {
                //                 ConnectionService.HandleServiceError(response, $scope, $location);
                //             })
                //     }).then(function () {
                //         for (var s in value.WatchShifts) {
                //             // TODO: Figure out structure of watch shift object and send it.
                //             WatchbillService.CreateWatchShift(s, function (response) {
                //                     console.log(response);
                //                     dayId = response.ReturnValue.Id;
                //                 },
                //                 // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                //                 function (response) {
                //                     ConnectionService.HandleServiceError(response, $scope, $location);
                //                 })
                //         }
                //
                //     })
                // });
                // WatchbillService.LoadWatchShift("e6664527-71c9-472f-a896-904bc5d120b2",
                //     function (response) {
                //         console.log(response);
                //     },
                //     // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                //     function (response) {
                //         ConnectionService.HandleServiceError(response, $scope, $location);
                //     }
                // )
            };
            WatchbillService.LoadWatchbill($routeParams.id,
                function (response) {
                    $scope.watchbill = response.ReturnValue;
                    $scope.weeks = [];
                    $scope.dayToCopy = [];

                    // Fix our dates to be Dates
                    angular.forEach(response.ReturnValue.WatchDays, function (value, index) {
                        $scope.watchbill.WatchDays[index].Date = new Date(value.Date);
                    });

                    // Sort our dates because Atwood is an ass
                    $scope.watchbill.WatchDays = $filter('orderBy')($scope.watchbill.WatchDays, 'Date');

                    // This is how much we have to adjust the start of the week in the calendar
                    var pushAmount = (new Date($scope.watchbill.WatchDays[0].Date)).getDay();

                    // Create an array of the weeks populated with the days
                    angular.forEach(response.ReturnValue.WatchDays, function (value, index) {
                        if (!$scope.weeks[Math.floor((pushAmount + index) / 7)]) {
                            $scope.weeks[Math.floor((pushAmount + index) / 7)] = [];
                        }
                        $scope.weeks[Math.floor((pushAmount + index) / 7)].push($scope.watchbill.WatchDays[index]);
                    });

                    $scope.blankStartDays = new Array(pushAmount);
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            )
        }
    ]
);
