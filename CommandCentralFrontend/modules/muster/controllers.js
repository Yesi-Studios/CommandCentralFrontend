'use strict';
 
angular.module('Muster')
 
.controller('MusterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService',
function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService) {
		
        // This scope will just about always contain PII
        $rootScope.containsPII = true;
        $scope.divisions = [];
        $scope.fields = ['FriendlyName', 'Paygrade', 'Division', 'HasBeenMustered']
        // The default sorting key
        $scope.orderKey = "Division";
        $scope.selectedDivision = "All";

        $scope.setDivision = function (selectedDivision) {
            $scope.displaySailorsList = []
            alert(selectedDivision);
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
                $scope.$apply(function () {
                    console.log(response.ReturnValue.MusterStatuses);
                    $scope.musterStatuses = response.ReturnValue.MusterStatuses;
                });
            },
            // If we fail, this is our call back (nearly the same for all backend calls)
            function (response) {
                $scope.$apply(function () {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                            AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                        }
                        AuthenticationService.ClearCredentials();
                        $location.path('/login');
                    } else {
                        // If it's any other type of error, we can just show it to them on this page.
                        $scope.errors = response.ErrorMessages;
                    }
                    $scope.dataLoading = false;
                });
            }
        );

        MusterService.LoadTodaysMuster(
            function (response) {
                console.log(response);
                $scope.$apply(function() {
                    // Create the divisions array
                    for (var i = 0; i < response.ReturnValue.Musters.length; i++) {
                        if ($scope.divisions.indexOf(response.ReturnValue.Musters[i].Division) == -1){
                            $scope.divisions.push(response.ReturnValue.Musters[i].Division);
                        }
                    }

                    $scope.displaySailorsList = response.ReturnValue.Musters;
                    $scope.allSailorsList = response.ReturnValue.Musters;
                })

            },
            // If we fail, this is our call back (nearly the same for all backend calls)
            function (response) {
                $scope.$apply(function () {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                            AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                        }
                        AuthenticationService.ClearCredentials();
                        $location.path('/login');
                    } else {
                        // If it's any other type of error, we can just show it to them on this page.
                        $scope.errors = response.ErrorMessages;
                    }
                    $scope.dataLoading = false;
                });
            }

            );

        $scope.submitMuster = function (musterList) {
            var dtoMuster = {};
            for (var i = 0; i < musterList.length; i++) {
                if (musterList[i].CurrentMusterStatus.MusterStatus != null) {
                    dtoMuster[musterList[i].Id] = musterList[i].CurrentMusterStatus.MusterStatus;
                }
            }

            MusterService.SubmitMuster(dtoMuster, 
                function (response) {
                    alert("Holy fuck");
                    console.log(response);
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
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
		
    ]);