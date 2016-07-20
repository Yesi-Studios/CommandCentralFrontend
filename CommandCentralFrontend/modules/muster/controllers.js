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
        },
        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
        function (response) {
            ConnectionService.HandleServiceError(response, $scope, $location);
        }

        );

    $scope.submitMuster = function (musterList) {
        var dtoMuster = {};
        for (var i = 0; i < musterList.length; i++) {
            if (musterList[i].CurrentMusterStatus.MusterStatus != null) {
                dtoMuster[musterList[i].Id] = musterList[i].CurrentMusterStatus.MusterStatus;
            }
        }

        $scope.messages = [];
        $scope.errors = [];

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

    $scope.getMuster = function (musterDate) {
        MusterService.LoadMusterByDay(musterDate, function (response) {

        },
        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
        function (response) {
            ConnectionService.HandleServiceError(response, $scope, $location);
        }
        );
    };

    $scope.command = {
        "name": "NIOC GA",
        "departments":
            {
                "N0":
                    {
                        "N0":
                            [
                                {
                                    "Musteree": {
                                        "Id": "263e1f86-4055-4191-8601-08fc69a3c26f",
                                        "FriendlyName": "CTI Atwood, Daniel "
                                    },
                                    "Musterer": {
                                        "Id": "3858e7df-7213-4789-b870-893b7997f4d8",
                                        "FriendlyName": "CTI McLean, Angus "
                                    },
                                    "MusterStatus": "Dead",
                                    "SubmitTime": "2016-07-20T12:59:49",
                                },
                                {
                                    "Musteree": {
                                        "Id": "263e1f86-4055-4191-8601-08fc69a3c26f",
                                        "FriendlyName": "CTI Atwood, Daniel "
                                    },
                                    "Musterer": {
                                        "Id": "3858e7df-7213-4789-b870-893b7997f4d8",
                                        "FriendlyName": "CTI McLean, Angus "
                                    },
                                    "MusterStatus": "Dead",
                                    "SubmitTime": "2016-07-20T12:59:49",
                                }
                            ]
                    },
                "N7":
                    {
                        "N75":
                            [
                                {
                                    "Musteree": {
                                        "Id": "263e1f86-4055-4191-8601-08fc69a3c26f",
                                        "FriendlyName": "CTI Atwood, Daniel "
                                    },
                                    "Musterer": {
                                        "Id": "3858e7df-7213-4789-b870-893b7997f4d8",
                                        "FriendlyName": "CTI McLean, Angus "
                                    },
                                    "MusterStatus": "Dead",
                                    "SubmitTime": "2016-07-20T12:59:49",
                                },
                                {
                                    "Musteree": {
                                        "Id": "263e1f86-4055-4191-8601-08fc69a3c26f",
                                        "FriendlyName": "CTI Atwood, Daniel "
                                    },
                                    "Musterer": null,
                                    "MusterStatus": "Dead",
                                    "SubmitTime": "2016-07-20T12:59:49",
                                }
                            ]
                    }
            }
    };
}
]);