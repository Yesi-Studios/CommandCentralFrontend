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
                $scope.progressing = true;
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
).controller('WatchbillPopulateController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            $scope.errors = [];
            $scope.messages = [];

            $scope.log = function (thing) {
                console.log(thing);
            };

            var originalWatchbill = {};

            $scope.thisDaySelected = function (day) {
                return $scope.selectedDay == day;
            };

            $scope.selectDay = function (day) {
                $scope.selectedDay = day;
            };
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

            $scope.submitChanges = function () {
                var newAssignments = [];
                for (var i in $scope.watchbill.WatchDays) {
                    for (var j in $scope.watchbill.WatchDays[i].WatchShifts) {
                        var shift = $scope.watchbill.WatchDays[i].WatchShifts[j];
                        var old = originalWatchbill.WatchDays[i].WatchShifts[j];
                        if (shift.WatchAssignment && (!shift.WatchAssignment.hasOwnProperty("Id") || !old.WatchAssignment || old.WatchAssignment.Id != shift.WatchAssignment.Id)) {
                            newAssignments.push({
                                "PersonAssigned": $scope.watchbill.WatchDays[i].WatchShifts[j].WatchAssignment.PersonAssigned.Id,
                                "WatchShift": shift.Id
                            })
                        }
                    }
                }
                if (newAssignments.length > 0) {
                    WatchbillService.CreateWatchAssignments(newAssignments, $scope.watchbill.Id,
                        function (response) {
                            // $scope.loadWatchbill();
                            $location.path('/watchbill/' + $scope.watchbill.Id);
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        });
                } else {
                    $scope.errors.push("No changes to submit");
                }


            };

            $scope.populate = function () {
                WatchbillService.PopulateWatchbill($routeParams.id,
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

                        $scope.selectedDay = null;
                        $scope.blankStartDays = new Array(pushAmount);
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );
            };
            $scope.loadWatchbill = function () {
                WatchbillService.LoadWatchbill($routeParams.id,
                    function (response) {
                        $scope.watchbill = response.ReturnValue;
                        originalWatchbill = response.ReturnValue;
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

                        $scope.selectedDay = $scope.weeks[0][0];
                        $scope.blankStartDays = new Array(pushAmount);
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );
            };
            $scope.loadWatchbill();
        }]
).controller('WatchbillController',
    ['$scope', '$route', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $route, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            $scope.resetWatchbill = function (id) {
                $scope.resetting = true;
                $scope.watchbill.CurrentState = {"Id": "fa1d4185-6a36-40de-81c6-843e6ee352f0"};
                WatchbillService.UpdateWatchbill($scope.watchbill, function (response) {
                        $location.path('/watchbill/' + $scope.watchbill.Id);
                        $route.reload();
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    })
            };

            $scope.toggleResetWarning = function () {
                $scope.showResetWarning = !$scope.showResetWarning;
            };

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
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', '$route', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, $route, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
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
                    delete fixed.Id;
                    if (fixed.numberOfDays > 1) {
                        fixed.Range.End.setDate(fixed.Range.End.getDate() + fixed.numberOfDays - 1);
                    }
                    day.WatchShifts.push(fixed);
                })
            };

            $scope.copyDay = function (day) {
                $scope.dayToCopy = angular.copy(day.WatchShifts);
                angular.forEach($scope.dayToCopy, function (value, index) {
                    value.numberOfDays = value.Range.End.getDate() - value.Range.Start.getDate() + 1;
                    if(value.Range.End.getMonth() != value.Range.Start.getMonth()) {
                        var month = value.Range.Start.getMonth();
                        var year = value.Range.Start.getYear();
                        value.numberOfDays += (new Date(year, month, 0)).getDate() + 1;
                    }
                });
            };

            $scope.generateDefault = function() {
                for (var i = 0; i < $scope.weeks.length; i++) {
                    var week = $scope.weeks[i];
                    for (var j = 0; j < week.length; j++) {
                        week[j].WatchShifts = WatchbillService.GetDefaultWatchShifts(week[j]);
                    }
                }
            };

            $scope.saveWatchBill = function () {
                var newDays = [];
                var newShifts = [];

                var uniqueById = function (a) {
                    var seen = {};
                    var out = [];
                    var len = a.length;
                    var j = 0;
                    for (var i = 0; i < len; i++) {
                        var item = a[i];
                        if (seen[item.Id] !== 1 || !item.hasOwnProperty("Id")) {
                            seen[item.Id] = 1;
                            out[j++] = item;
                        }
                    }
                    console.log(out);
                    return out;
                };

                for (var d in $scope.watchbill.WatchDays) {
                    for (var s in $scope.watchbill.WatchDays[d].WatchShifts) {
                        newShifts.push($scope.watchbill.WatchDays[d].WatchShifts[s]);
                    }
                }

                newShifts = uniqueById(newShifts);

                // First, delete all the watch days in the backend
                var watchdayIds = [];

                angular.forEach($scope.watchbill.WatchDays, function (value, key) {
                    this.push(value.Id);
                }, watchdayIds);
                WatchbillService.DeleteWatchDays(watchdayIds, function (response) {
                        console.log(response);
                        WatchbillService.CreateWatchDays($scope.watchbill.WatchDays, $scope.watchbill.Id, function (response) {
                                newDays = response.ReturnValue;

                                WatchbillService.CreateWatchShifts(newShifts, $scope.watchbill.Id, function (response) {
                                        console.log(response);
                                        // $route.reload();
                                        $location.path('/watchbill/' + $routeParams.id);
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
).controller('WatchbillSwapController', ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
    function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
        $scope.message = [];
        $scope.errors = [];

        $scope.selectShift = function (shift) {
            if ($scope.firstShift && shift != $scope.firstShift) {
                $scope.secondShift = shift;
            } else {
                $scope.firstShift = shift;
            }
        };

        $scope.clearShifts = function () {
            $scope.firstShift = null;
            $scope.secondShift = null;
        };

        $scope.swapShifts = function () {
            WatchbillService.SwapWatchAssignments($scope.firstShift.WatchAssignment.Id, $scope.secondShift.WatchAssignment.Id, function (response) {
                    console.log(response);
                    $scope.firstShift = null;
                    $scope.secondShift = null;
                    loadWatchbill();
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                });
        };

        var loadWatchbill = function () {
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
        };
        loadWatchbill();
    }]
).controller('WatchbillInputController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {

            $scope.messages = [];
            $scope.errors = [];

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

            $scope.loadWatchbill = function () {
                WatchbillService.LoadWatchbill($routeParams.id,
                    function (response) {
                        $scope.watchbill = response.ReturnValue;
                        $scope.weeks = [];
                        $scope.inputs = [];

                        var stillRequired = [];
                        angular.forEach($scope.watchbill.InputRequirements, function (e) {
                            if (!e.IsAnswered) {
                                this.push(e.Person.Id);
                            }
                        }, stillRequired);
                        $scope.asteriskForRequirement = function (id) {
                            if (stillRequired.indexOf(id) > -1) {
                                return "*";
                            }
                            return "";
                        };

                        WatchbillService.LoadWatchInputs($routeParams.id, function (response) {
                                $scope.inputs = response.ReturnValue;
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );

                        $scope.submitInput = function () {
                            var shifts = [];
                            for (var w = 0; w < $scope.weeks.length; w++) {
                                for (var d = 0; d < $scope.weeks[w].length; d++) {
                                    for (var s = 0; s < $scope.weeks[w][d].WatchShifts.length; s++) {
                                        if ($scope.weeks[w][d].WatchShifts[s].checked) {
                                            shifts.push($scope.weeks[w][d].WatchShifts[s]);
                                            $scope.weeks[w][d].WatchShifts[s].checked = false;
                                        }
                                    }
                                }
                            }

                            WatchbillService.CreateWatchInput($scope.selectedPerson, shifts, $scope.reason, function (response) {
                                    $scope.messages.push("Input successfully submitted for " + $scope.selectedPerson.FriendlyName);
                                    $scope.loadWatchbill();
                                },
                                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                function (response) {
                                    ConnectionService.HandleServiceError(response, $scope, $location);
                                })
                        };

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

                        // for (var w = 0; w < $scope.weeks.length; w++) {
                        //     for (var d = 0; d < $scope.weeks[w].length; d++) {
                        //         for (var s = 0; s < $scope.weeks[w][d].WatchShifts.length; s++) {
                        //             if ($scope.weeks[w][d].WatchShifts[s].WatchInputs) {
                        //                 for (var imp = 0; imp < $scope.weeks[w][d].WatchShifts[s].WatchInputs.length; imp++) {
                        //                     $scope.inputs.push($scope.weeks[w][d].WatchShifts[s].WatchInputs[imp]);
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                        var permissionLevel = $rootScope.globals.currentUser.permissions.HighestLevels[$scope.watchbill.EligibilityGroup.OwningChainOfCommand];
                        ProfileService.LoadProfile($rootScope.globals.currentUser.userID, function (response) {
                                var valId = response.ReturnValue.Person[permissionLevel];
                                WatchbillService.GetAllLists(function (response) {
                                        var val = "";
                                        $scope.reasons = response.ReturnValue.WatchInputReason;
                                        // console.log(response.ReturnValue[permissionLevel]);
                                        // console.log(valId);
                                        for (var k in response.ReturnValue[permissionLevel]) {
                                            if (response.ReturnValue[permissionLevel][k].Id == valId) {
                                                val = response.ReturnValue[permissionLevel][k].Value;
                                            }
                                        }
                                        WatchbillService.GetSubordinatePersons(permissionLevel, val, function (response) {

                                                $scope.inputPeople = [];
                                                var subordIds = [];
                                                for (var l = 0; l < response.ReturnValue.Results.length; l++) {
                                                    subordIds.push(response.ReturnValue.Results[l].Id);
                                                }
                                                for (var h = 0; h < $scope.watchbill.EligibilityGroup.EligiblePersons.length; h++) {
                                                    if (subordIds.indexOf($scope.watchbill.EligibilityGroup.EligiblePersons[h].Id) >= 0) {
                                                        $scope.inputPeople.push($scope.watchbill.EligibilityGroup.EligiblePersons[h])
                                                    }
                                                }

                                                // console.log("********");
                                                // console.log($scope.inputPeople);
                                                // console.log(subordIds);
                                                // console.log($scope.watchbill.EligibilityGroup.EligiblePersons);
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
                )
            };
            $scope.loadWatchbill();
        }]
).controller('WatchbillEligibilityController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
            $scope.messages = [];
            $scope.errors = [];

            $scope.updateLists = function () {
                for (var i = 0; i < $scope.groups.length; i++) {
                    if ($scope.groups[i].Id == $scope.originalSelectedGroup.Id) {
                        $scope.selectedGroup = $scope.groups[i];
                    }
                }
                $scope.notInGroup = arrayDifference($scope.allPeople, $scope.selectedGroup.EligiblePersons);
            };

            /**
             * Compare two arrays, and return all values that are in one but not the other.
             * @param {Array} firstArray
             * @param {Array} secondArray
             * @returns {Array}
             */
            var arrayDifference = function (firstArray, secondArray) {
                var a = [], result = [];

                for (var i = 0; i < firstArray.length; i++) {
                    a[firstArray[i].Id] = firstArray[i].FriendlyName;
                }

                for (var i = 0; i < secondArray.length; i++) {
                    if (a[secondArray[i].Id]) {
                        delete a[secondArray[i].Id]
                    } else {
                        a[secondArray[i].Id] = secondArray[i].FriendlyName;
                    }
                }

                for (var k in a) {
                    result.push({'Id': k, 'FriendlyName': a[k]})
                }

                return result;
            };

            /**
             * Adds people to the current group
             * @param {Array} peopleToAdd
             */
            $scope.addPeople = function (peopleToAdd) {
                for (var i = 0; i < peopleToAdd.length; i++) {
                    $scope.selectedGroup.EligiblePersons.push(peopleToAdd[i]);
                }
                $scope.selectedGroup.UneligiblePersons = arrayDifference($scope.selectedGroup.UneligiblePersons, peopleToAdd);
                $scope.peopleToAdd = [];
            };

            /**
             * Removes people from the current group
             * @param {Array} peopleToRemove
             */
            $scope.removePeople = function (peopleToRemove) {
                for (var i = 0; i < peopleToRemove.length; i++) {
                    $scope.selectedGroup.UneligiblePersons.push(peopleToRemove[i]);
                }
                $scope.selectedGroup.EligiblePersons = arrayDifference(peopleToRemove, $scope.selectedGroup.EligiblePersons)
                $scope.peopleToRemove = [];
            };

            /**
             * Creates friendly name of a person
             * @param person - The person object to make a friendly name for
             * @param person.FirstName
             * @param person.LastName
             * @param person.MiddleName
             * @returns {string}
             */
            var friendlyName = function (person) {
                return person.LastName + ", " + person.FirstName + " " + person.MiddleName;
            };


            $scope.loadGroups = function() {
                WatchbillService.GetAllPeople(function (response) {
                        $scope.allPeople = [];
                        angular.forEach(response.ReturnValue.Results, function (value, key) {
                            this.push({
                                'Id': value.Id,
                                'FriendlyName': friendlyName(value)
                            })
                        }, $scope.allPeople);

                        WatchbillService.GetAllLists(function (response) {
                                $scope.groups = response.ReturnValue.WatchEligibilityGroup;
                                if($scope.groups) { $scope.selectedGroup = $scope.groups[0]; }
                                for (var i = 0; i < $scope.groups.length; i++) {
                                    $scope.groups[i].UneligiblePersons = arrayDifference($scope.groups[i].EligiblePersons, $scope.allPeople);
                                }
                                $scope.messages = [];
                                $scope.errors = [];
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

            $scope.submit = function(id, persons) {
                var personIds = [];
                angular.forEach(persons, function(value, key) {
                    this.push(value.Id);
                }, personIds);
                WatchbillService.EditWatchEligibilityGroup(id, personIds, function(response){
                    $scope.messages.push("Successfully updated, reloading...");
                    $scope.loadGroups();
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                });
            };

            $scope.loadGroups()

        }]
).controller('WatchbillApproveController',
    ['$scope', '$rootScope', '$filter', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService', 'WatchbillService',
        function ($scope, $rootScope, $filter, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService, WatchbillService) {
            $scope.messages = [];
            $scope.errors = [];

            $scope.inputs = [];
            $scope.noNewInputs = true;

            $scope.getByValue = function (arr, prop, val) {
                return $filter('filter')(arr, {prop: val})[0] || {};
            };

            $scope.confirm = function (input) {
                input.IsConfirmed = true;
                WatchbillService.ConfirmWatchInput(input.Id, function (response) {
                        $scope.messages.push("Confirmed watch input for " + input.Person.FriendlyName);
                        $scope.loadWatchbill();
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    });
            };

            $scope.delete = function (input) {
                WatchbillService.DeleteWatchInput(input.Id, function (response) {
                        $scope.messages.push("Deleted watch input for " + input.Person.FriendlyName);
                        $scope.loadWatchbill();
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    });
            };

            WatchbillService.GetAllLists(function (response) {
                    $scope.lists = response.ReturnValue;
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                });

            $scope.loadWatchbill = function () {
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

                        WatchbillService.LoadWatchInputs($routeParams.id, function (response) {
                                $scope.inputs = response.ReturnValue;
                                for (var j = 0; j < $scope.inputs; j++) {
                                    if (!$scope.inputs[j].IsConfirmed) {
                                        $scope.noNewInputs = false;
                                    }
                                }
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );
                        // $scope.inputs = [];
                        //
                        // for (var w = 0; w < $scope.weeks.length; w++) {
                        //     for (var d = 0; d < $scope.weeks[w].length; d++) {
                        //         for (var s = 0; s < $scope.weeks[w][d].WatchShifts.length; s++) {
                        //             if ($scope.weeks[w][d].WatchShifts[s].WatchInputs) {
                        //                 for (var imp = 0; imp < $scope.weeks[w][d].WatchShifts[s].WatchInputs.length; imp++) {
                        //                     $scope.inputs.push($scope.weeks[w][d].WatchShifts[s].WatchInputs[imp]);
                        //                     if (!$scope.weeks[w][d].WatchShifts[s].WatchInputs[imp].isConfirmed) {
                        //                         $scope.noNewInputs = false;
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );
            };
            $scope.loadWatchbill();
        }]
);
