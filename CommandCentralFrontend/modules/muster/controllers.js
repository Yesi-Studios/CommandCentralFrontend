'use strict';

angular.module('Muster')

.controller('MusterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService) {

        // This scope will just about always contain PII
        $rootScope.containsPII = true;
        $scope.divisions = [];
        $scope.fields = ['FriendlyName', 'Paygrade', 'Division', 'HasBeenMustered']
        $scope.errors = [];
        $scope.messages = [];

        var originalMusterList = [];

        // The default sorting key
        $scope.orderKey = "Division";
        $scope.selectedDivision = "All";

        $scope.setDivision = function (selectedDivision) {
            $scope.displaySailorsList = []
            if (selectedDivision == "All") {
                $scope.displaySailorsList = $scope.allSailorsList;
                return;
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
                $scope.musterStatuses = response.ReturnValue.MusterStatuses;

            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );

        MusterService.LoadTodaysMuster(
            function (response) {
                // Create the divisions array
                for (var i = 0; i < response.ReturnValue.Musters.length; i++) {
                    if ($scope.divisions.indexOf(response.ReturnValue.Musters[i].Division) == -1) {
                        $scope.divisions.push(response.ReturnValue.Musters[i].Division);
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
            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }

            );

        $scope.submitMuster = function (musterList) {
            var dtoMuster = {};
            for (var i = 0; i < musterList.length; i++) {
                if (musterList[i].CurrentMusterStatus.MusterStatus != null && musterList[i].CurrentMusterStatus.MusterStatus != originalMusterList[i].CurrentMusterStatus.MusterStatus) {
                    dtoMuster[musterList[i].Id] = musterList[i].CurrentMusterStatus.MusterStatus;
                }
            }

            $scope.messages = [];
            $scope.errors = [];
            console.log(dtoMuster);
            if (JSON.stringify(dtoMuster) === JSON.stringify({})) { $scope.errors.push("No muster records altered"); return; }
            MusterService.SubmitMuster(dtoMuster,
                function (response) {
                    $scope.messages.push("Muster successfully submitted.")
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            )
        }

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
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService) {
        $scope.musterDate = new Date();
        $scope.musterDate.setDate($scope.musterDate.getDate() - 1);

        $scope.viewBy = "division";

        $scope.getMuster = function (musterDate) {
            $scope.errors = [];
            MusterService.LoadMusterByDay(musterDate,
                function (response) {
                    console.log(response);
                    if (response.ReturnValue.length == 0) {
                        $scope.errors.push("No muster records for that date.");
                    } else {
                        $scope.command = {
                            "name": response.ReturnValue[0].Command,
                            "departments": {},
                            "uics": {}
                        }
                        for (var i in response.ReturnValue) {
                            var record = response.ReturnValue[i];
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
    }
])
.controller('FinalizeMusterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService) {
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