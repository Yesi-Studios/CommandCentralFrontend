'use strict';
 
angular.module('Authorization')
 
.controller('AuthorizationController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {
        
        }
    ]
)
.controller('EditPermissionGroupsController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService',
        function($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService){
            AuthorizationService.GetUserPermissionGroups($routeParams.id,
                function(response) {
                        $scope.errors = [];
                        $scope.messages = [];
                        $scope.friendlyName = response.ReturnValue.FriendlyName;
                        $scope.allPermissionGroups = response.ReturnValue.AllPermissionGroups;
                        $scope.userPermissionGroups = response.ReturnValue.CurrentPermissionGroups;
                        $scope.editablePermissionGroups = response.ReturnValue.EditablePermissionGroups;

                        $scope.givePermissionGroup = function (group) {
                            for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                                if ($scope.userPermissionGroups[i].Id == group.Id) {
                                    $scope.errors.push('User already has this permission.');
                                    return;
                                }
                            }
                            $scope.userPermissionGroups.push(group);
                        };

                        $scope.removePermissionGroup = function (group) {
                            for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                                if ($scope.userPermissionGroups[i].Id == group.Id) {
                                    $scope.userPermissionGroups.splice(i, 1);
                                }
                            }
                        };

                        $scope.canEditPermissionGroup = function (group) {
                            for (var i = 0; i < $scope.editablePermissionGroups.length; i++) {
                                if ($scope.editablePermissionGroups[i].Id == group.Id) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        $scope.updatePermissions = function () {
                            $scope.errors = [];
                            $scope.messages = [];
                            var groupIDs = [];
                            for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                                groupIDs.push($scope.userPermissionGroups[i].Id);
                            }
                            AuthorizationService.UpdateUserPermissionGroups($routeParams.id, groupIDs,
                                function (response) {
                                        $scope.messages.push('Permissions successfully updated.');
                                        if (!response.ReturnValue.WasSelf) {
                                            AuthenticationService.AddLoginError("Your permissions have changed. Please re-login.");
                                            AuthenticationService.ClearCredentials();
                                            $location.path('/login');
                                        }
                                    
                                },
                                // If we fail, this is our call back (nearly the same for all backend calls)
                                function (response) {
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
                                    
                                }
                            );
                            
                        };
                    
                },
                // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
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
                    
                }
            );

        }
    ]
);