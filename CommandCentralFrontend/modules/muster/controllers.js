'use strict';

angular.module('Muster')

    .controller('MusterController',
        ['$scope', '$filter', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $filter, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {

                // This scope will just about always contain PII
                $rootScope.containsPII = true;
                $scope.divisions = [];
                $scope.fields = ['FriendlyName', 'Paygrade', 'Division', 'HasBeenMustered'];
                $scope.errors = [];
                $scope.messages = [];

                var originalMusterList = [];

                $scope.itemsPerPage = "50";
                $scope.currentPage = 1;
                $scope.displaySailorsList = [];

                $scope.pageCount = function () {
                    return Math.ceil($scope.friends.length / $scope.itemsPerPage);
                };

                $scope.$watch('currentPage + itemsPerPage + setOrder + displaySailorsList + orderKey + showUnmustered', function () {
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;

                    $scope.displaySailorsList = $filter('orderBy')($scope.displaySailorsList, $scope.orderKey);
                    if ($scope.showUnmustered) {
                        $scope.filteredDisplaySailorsList = $filter('filter')($scope.displaySailorsList, { HasBeenMustered: false }).slice(begin, end)
                    } else {
                        $scope.filteredDisplaySailorsList = $scope.displaySailorsList.slice(begin, end);
                    }

                    $scope.unmusteredSailorsList = [];
                    for (var i in $scope.displaySailorsList) {
                        if (!$scope.displaySailorsList[i].HasBeenMustered) {
                            $scope.unmusteredSailorsList.push($scope.displaySailorsList[i]);
                        }
                    }
                });
                // The default sorting key
                $scope.orderKey = "Division";
                $scope.selectedDivision = "All";

                $scope.setDivision = function (selectedDivision) {
                    $scope.displaySailorsList = [];
                    if (selectedDivision == "All") {
                        $scope.displaySailorsList = $scope.allSailorsList;
                    } else {
                        for (var i = 0; i < $scope.allSailorsList.length; i++) {
                            if ($scope.allSailorsList[i].Division == selectedDivision) {
                                $scope.displaySailorsList.push($scope.allSailorsList[i]);
                            }
                        }
                    }
                };


                ProfileService.GetAllLists(
                    // If we succeed, this is our call back
                    function (response) {
                        $scope.musterStatuses = response.ReturnValue.MusterStatus;

                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );

                $scope.dataLoading = true;
                MusterService.LoadTodaysMuster(
                    function (response) {

                        $scope.dataLoading = false;
                        // Create the divisions array
                        for (var j = 0; j < response.ReturnValue.Musters.length; j++) {
                            if ($scope.divisions.indexOf(response.ReturnValue.Musters[j].Division) == -1) {
                                $scope.divisions.push(response.ReturnValue.Musters[j].Division);
                            }
                        }

                        $scope.displaySailorsList = response.ReturnValue.Musters;
                        $scope.allSailorsList = response.ReturnValue.Musters;


                        for (var i in $scope.displaySailorsList) {
                            originalMusterList[i] = {
                                "CurrentMusterStatus": {
                                    "MusterStatus": $scope.displaySailorsList[i].CurrentMusterStatus.MusterStatus
                                }
                            }
                        }
                        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                            end = begin + $scope.itemsPerPage;

                        $scope.displaySailorsList = $filter('orderBy')($scope.displaySailorsList, $scope.orderKey);
                        $scope.filteredDisplaySailorsList = $scope.displaySailorsList.slice(begin, end);

                        $scope.unmusteredSailorsList = [];
                        for (var i in $scope.displaySailorsList) {
                            if (!$scope.displaySailorsList[i].HasBeenMustered) {
                                $scope.unmusteredSailorsList.push($scope.displaySailorsList[i]);
                            }
                        }
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }

                );

                $scope.submitMuster = function (musterList) {
                    var dtoMuster = {};
                    console.log(musterList);
                    for (var i = 0; i < musterList.length; i++) {
                        if (musterList[i].CurrentMusterStatus.MusterStatus != null && musterList[i].CurrentMusterStatus.MusterStatus != originalMusterList[i].CurrentMusterStatus.MusterStatus) {
                            dtoMuster[musterList[i].Id] = musterList[i].CurrentMusterStatus.MusterStatus;
                        }
                    }

                    $scope.messages = [];
                    $scope.errors = [];
                    if(config.debugMode) console.log(dtoMuster);
                    if (JSON.stringify(dtoMuster) === JSON.stringify({})) {
                        $scope.errors.push("No muster records altered");
                        return;
                    }
                    MusterService.SubmitMuster(dtoMuster,
                        function (response) {
                            $scope.messages.push("Muster successfully submitted.")
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    )
                };

                // Give our scope a way to sort
                $scope.setOrder = function (theKey) {
                    if ($scope.orderKey == theKey) {
                        $scope.orderKey = "-" + theKey;
                    } else {
                        $scope.orderKey = theKey;
                    }
                }
            }
        ])
    .controller('MusterArchiveController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {
                $scope.musterDate = new Date();
                $scope.musterDate.setDate($scope.musterDate.getDate() - 1);

                $scope.viewBy = "division";

                $scope.goToMuster = function (filters, fields, level) {
                        $location.path('/muster/archive/' + $scope.musterDate);
                };
                var getMuster = function (musterDate) {
                    $scope.errors = [];
                    MusterService.LoadMusterByDay(musterDate,
                        function (response) {
                            if(config.debugMode) console.log(response);
                            if (response.ReturnValue.length == 0) {
                                $scope.errors.push("No muster records for that date.");
                            } else {
                                $scope.showProgress = true;
                                $scope.musterCounts = {
                                    "Present" : 0,
                                    "Terminal_Leave" : 0,
                                    "Leave" : 0,
                                    "UA" : 0,
                                    "SIQ" : 0,
                                    "Transferred" : 0,
                                    "Total" : response.ReturnValue.length
                                };
                                $scope.command = {
                                    "name": response.ReturnValue[0].Command,
                                    "departments": {},
                                    "uics": {}
                                };
                                for (var i in response.ReturnValue) {
                                    var record = response.ReturnValue[i];
                                    $scope.musterCounts[record["MusterStatus"]] += 1;
                                    if (!$scope.command.departments[record.Department]) {
                                        $scope.command.departments[record.Department] = {};
                                    }
                                    if (!$scope.command.departments[record.Department][record.Division]) {
                                        $scope.command.departments[record.Department][record.Division] = [];
                                    }
                                    $scope.command.departments[record.Department][record.Division].push(record);

                                    if (!record.UIC) { record.UIC = "NONE";}
                                    if (!$scope.command.uics[record.UIC]) {
                                        $scope.command.uics[record.UIC] = [];
                                    }
                                    $scope.command.uics[record.UIC].push(record);

                                }
                            }
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };

                if($routeParams.musterDate) {
                    $scope.musterDate = new Date($routeParams.musterDate.replace(/\"/g, ""));
                }
                getMuster($scope.musterDate);
            }
        ])
    .controller('FinalizeMusterController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {
                $scope.errors = [];
                $scope.messages = [];
                $scope.finalizeMuster = function () {
                    $scope.dataLoading = true;
                    $scope.errors = [];
                    $scope.messages = [];

                    MusterService.FinalizeMuster(
                        function () {
                            $scope.dataLoading = false;
                            $scope.messages.push("Muster successfully finalized.");
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                }
            }
        ]).filter('yesNo', function() {
    return function(input) {
        return input ? 'Yes' : 'No';
    }
});