'use strict';

angular.module('Watchbill')
    .controller('WatchbillsController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

                WatchbillService.GetAllLists(function (response) {
                        $scope.eligibilityGroups = response.ReturnValue.WatchEligibilityGroup;
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    });

                WatchbillService.LoadWatchbills(
                    function (response) {
                        $scope.watchbills = response.ReturnValue;
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );
            }]
    ).controller('WatchbillProgressController',
    ['$scope', '$rootScope', '$location', '$routeParams', '$filter', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $location, $routeParams, $filter, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            var getByValue = function (arr, prop, val) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][prop] == val) {
                        return arr[i];
                    }
                }
                return {};
            };

            $scope.getByValue = getByValue;

            $scope.moveToNextStep = function () {
                $scope.watchbill.CurrentState = $scope.nextStatus;
                WatchbillService.UpdateWatchbill($scope.watchbill, function (response) {
                        $location.path('/watchbill/' + $scope.watchbill.Id);
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    })
            };

            WatchbillService.GetAllLists(function (response) {
                    $scope.statuses = response.ReturnValue.WatchbillStatus;
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }).then(function () {

                WatchbillService.LoadWatchbill($routeParams.id,
                    function (response) {
                        $scope.watchbill = response.ReturnValue;
                        $scope.weeks = [];
                        switch ($scope.watchbill.CurrentState.Value) {
                            case 'Initial':
                                $scope.nextStatus = getByValue($scope.statuses, 'Value', 'Open for Inputs');
                                break;
                            case 'Open for Inputs':
                                $scope.nextStatus = getByValue($scope.statuses, 'Value', 'Closed for Inputs');
                                break;
                            case 'Closed for Inputs':
                                $scope.nextStatus = getByValue($scope.statuses, 'Value', 'Under Review');
                                break;
                            case 'Under Review':
                                $scope.nextStatus = getByValue($scope.statuses, 'Value', 'Published');
                                break;
                            default:
                                $scope.nextStatus = {'Value': 'ALREADY IN FINAL STAGE'};
                        }
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );
            });
        }]
).controller('WatchbillController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            $scope.getByValue = function (arr, prop, val) {
                return $filter('filter')(arr, {prop: val})[0] || {};
            };
            WatchbillService.GetAllLists(function (response) {
                    $scope.lists = response.ReturnValue;
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                });

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
            );
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
                    fixed.Range.Start.setYear(day.Date.getFullYear());
                    fixed.Range.End.setDate(day.Date.getDate());
                    fixed.Range.End.setMonth(day.Date.getMonth());
                    fixed.Range.End.setYear(day.Date.getFullYear());
                    console.log(value);
                    console.log(fixed);
                    day.WatchShifts.push(fixed);
                })
            };

            $scope.copyDay = function (day) {
                console.log($scope.dayToCopy);
                console.log(day);
                $scope.dayToCopy = angular.copy(day.WatchShifts);
            };

            $scope.saveWatchBill = function () {
                var newDays = [];
                var newShifts = [];

                for (var d in $scope.watchbill.WatchDays) {
                    for (var s in $scope.watchbill.WatchDays[d].WatchShifts) {
                        newShifts.push($scope.watchbill.WatchDays[d].WatchShifts[s]);
                    }
                }

                // First, delete all the watch days in the backend
                WatchbillService.DeleteWatchDays($scope.watchbill.WatchDays, function (response) {
                        console.log(response);
                        WatchbillService.CreateWatchDays($scope.watchbill.WatchDays, function (response) {
                                newDays = response.ReturnValue;

                                WatchbillService.CreateWatchShifts(newShifts, $scope.watchbill.Id, function (response) {
                                        console.log(response)
                                    },
                                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                    function (response) {
                                        ConnectionService.HandleServiceError(response, $scope, $location);
                                    });
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            });
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    });

            };
            WatchbillService.LoadWatchbill($routeParams.id,
                function (response) {
                    $scope.watchbill = response.ReturnValue;
                    $scope.weeks = [];
                    $scope.dayToCopy = [];

                    // Fix our dates to be Dates
                    angular.forEach(response.ReturnValue.WatchDays, function (value, index) {
                        $scope.watchbill.WatchDays[index].Date = new Date(value.Date);
                        $scope.watchbill.WatchDays[index].Watchbill = {"Id": $scope.watchbill.Id};
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
).controller('WatchbillInputController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {


            $scope.getByValue = function (arr, prop, val) {
                return $filter('filter')(arr, {prop: val})[0] || {};
            };
            WatchbillService.GetAllLists(function (response) {
                    $scope.lists = response.ReturnValue;
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                });

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

                    var permissionLevel = $rootScope.globals.currentUser.permissions.HighestLevels[$scope.watchbill.EligibilityGroup.OwningChainOfCommand];
                    ProfileService.LoadProfile($rootScope.globals.currentUser.userID, function (response) {
                        var valId = response.ReturnValue.Person[permissionLevel];
                            WatchbillService.GetAllLists(function (response) {
                                var val = "";
                                console.log(response.ReturnValue[permissionLevel]);
                                console.log(valId);
                                for (var k in response.ReturnValue[permissionLevel]){
                                    if(response.ReturnValue[permissionLevel][k].Id == valId) {
                                        val = response.ReturnValue[permissionLevel][k].Value;
                                    }
                                }
                                    WatchbillService.GetSubordinatePersons(permissionLevel, val, function(response){

                                        $scope.inputPeople = [];
                                        var subordIds = [];
                                        for (var l = 0; l < response.ReturnValue.Results.length; l++) {
                                            subordIds.push(response.ReturnValue.Results[l].Id);
                                        }
                                        for (var h = 0; h < $scope.watchbill.EligibilityGroup.EligiblePersons.length; h++) {
                                            if (subordIds.indexOf($scope.watchbill.EligibilityGroup.EligiblePersons[h].Id) >= 0){
                                                $scope.inputPeople.push($scope.watchbill.EligibilityGroup.EligiblePersons[h])
                                            }
                                        }

                                            console.log("********");
                                            console.log($scope.inputPeople);
                                            console.log(subordIds);
                                            console.log($scope.watchbill.EligibilityGroup.EligiblePersons);
                                    },
                                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                        function (response) {
                                            ConnectionService.HandleServiceError(response, $scope, $location);
                                        });
                                },
                                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                function (response) {
                                    ConnectionService.HandleServiceError(response, $scope, $location);
                                });
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        });
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }]
).controller('WatchbillApproveController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            $scope.getByValue = function (arr, prop, val) {
                return $filter('filter')(arr, {prop: val})[0] || {};
            };
            WatchbillService.GetAllLists(function (response) {
                    $scope.lists = response.ReturnValue;
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                });

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
            );
        }]
);