'use strict';

angular.module('Muster')

    .controller('MusterController',
        ['$scope', '$filter', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $filter, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {

                // This scope will just about always contain PII
                $rootScope.containsPII = true;
                $scope.divisions = [];
                //$scope.fields = ['FriendlyName', 'Paygrade', 'Division', 'HasBeenMustered'];
                $scope.errors = [];
                $scope.messages = [];

                var oldStatusList = [];
                $scope.itemsPerPage = "50";
                $scope.currentPage = 1;
                $scope.newStatusList = [];
                $scope.groupCount = 0;

                // The default sorting key
                $scope.orderKey = "Division";
                $scope.selectedDivision = "All";

                $scope.pageCount = function () {
                    return Math.ceil($scope.friends.length / $scope.itemsPerPage);
                };

                $scope.makeDisplayList = function() {
                    var begin = (parseInt($scope.currentPage, 10) - 1) * parseInt($scope.itemsPerPage, 10);
                    var end = parseInt(begin, 10) + parseInt($scope.itemsPerPage, 10);
                    $scope.newStatusList = $filter('orderBy')($scope.newStatusList, $scope.orderKey);



                    // FILTER FOR GROUP HERE
                    if ($scope.selectedDivision == 'All') {
                        $scope.groupCount = $scope.newStatusList.length;
                        $scope.unmusteredSailorsList = $filter('filter')($scope.newStatusList, { HasBeenMustered: false });
                        if ($scope.showUnmustered) {
                            $scope.displayList = $scope.unmusteredSailorsList.slice(begin, end)
                        } else {
                            $scope.displayList = $scope.newStatusList.slice(begin, end);
                        }
                    } else {
                        var sailorsInThisGroup = $filter('filter')($scope.newStatusList, { Division : $scope.selectedDivision });
                        $scope.groupCount = sailorsInThisGroup.length;
                        $scope.unmusteredSailorsList = $filter('filter')(sailorsInThisGroup, { HasBeenMustered: false });
                        if ($scope.showUnmustered) {
                            $scope.displayList = $scope.unmusteredSailorsList.slice(begin, end)
                        } else {
                            $scope.displayList = sailorsInThisGroup.slice(begin, end);
                        }
                    }
                };

                $scope.$watch('currentPage + itemsPerPage + setOrder + newStatusList + orderKey + showUnmustered', function () {
                    $scope.makeDisplayList();
                });

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

                var loadMuster = function() {
                    $scope.dataLoading = true;
                    MusterService.LoadTodaysMuster(
                    function (response) {

                        $scope.dataLoading = false;
                        $scope.errors = [];
                        $scope.messages= [];
                        // Create the divisions array
                        for (var j = 0; j < response.ReturnValue.Musters.length; j++) {
                            if ($scope.divisions.indexOf(response.ReturnValue.Musters[j].Division) == -1) {
                                $scope.divisions.push(response.ReturnValue.Musters[j].Division);
                            }
                        }

                        $scope.newStatusList = response.ReturnValue.Musters;

                        oldStatusList = angular.copy(response.ReturnValue.Musters);

                        $scope.makeDisplayList();

                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }

                );};

                loadMuster();

                $scope.submitMuster = function (musterList) {
                    var dtoMuster = {};
                    for (var i = 0; i < musterList.length; i++) {
                        if (musterList[i].CurrentMusterStatus.MusterStatus != null && musterList[i].CurrentMusterStatus.MusterStatus != $filter('filter')(oldStatusList, {Id: musterList[i].Id})[0].CurrentMusterStatus.MusterStatus) {
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
                            $scope.messages.push("Muster successfully submitted. Please wait for updated muster to load before submitting more changes.");
                            loadMuster();
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

                // Default sorting
                $scope.viewBy = "division";

                var getIndexByValue = function(list, name){
                    for(var i in list) {
                        if(list[i].Value == name){
                            return i;
                        }
                    }
                    return -1;
                };

                $scope.goToMuster = function (filters, fields, level) {
                        $location.path('/muster/archive/' + $scope.musterDate);
                };
                var getMuster = function (musterDate) {
                    $scope.errors = [];
                    $scope.dataLoading = true;
                    MusterService.LoadMusterByDay(musterDate,
                        function (response) {
                            $scope.dataLoading = false;
                            if(config.debugMode) console.log(response);
                            if (response.ReturnValue.length == 0) {
                                $scope.errors.push("No muster records for that date.");
                            } else {
                                $scope.showProgress = true;
                                $scope.fieldThing = {};
                                $scope.musterCounts = {
                                    "Present" : 0,
                                    "Terminal Leave" : 0,
                                    "Leave" : 0,
                                    "AA" : 0,
                                    "UA" : 0,
                                    "SIQ" : 0,
                                    "TAD" : 0,
                                    "Deployed" :0,
                                    "Total" : response.ReturnValue.length
                                };
                                $scope.command = {
                                    "name": response.ReturnValue[0].Command,
                                    "departments": [],
                                    "uics": []
                                };
                                for (var i in response.ReturnValue) {
                                    var record = response.ReturnValue[i];
                                    $scope.musterCounts[record["MusterStatus"]] += 1;
                                    $scope.fieldThing[record["MusterStatus"]] = "thing";
                                    var depId = getIndexByValue($scope.command.departments, record.Department);
                                    if (depId == -1) {
                                        $scope.command.departments.push(
                                            {
                                                Value: record.Department,
                                                Divisions : []
                                            });
                                        depId = getIndexByValue($scope.command.departments, record.Department);
                                    }
                                    var divId = getIndexByValue($scope.command.departments[depId].Divisions, record.Division);
                                    if (divId == -1) {
                                        $scope.command.departments[depId].Divisions.push(
                                            {
                                                Value: record.Division,
                                                Sailors : []
                                            });
                                        divId = getIndexByValue($scope.command.departments[depId].Divisions, record.Division);
                                    }
                                    $scope.command.departments[depId].Divisions[divId].Sailors.push(record);
                                    if (!record.UIC) { record.UIC = "NONE";}
                                    if (!$scope.command.uics[record.UIC]) {
                                        $scope.command.uics[record.UIC] = [];
                                    }
                                    $scope.command.uics[record.UIC].push(record);

                                } console.log($scope.command);
                                console.log($scope.fieldThing);
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