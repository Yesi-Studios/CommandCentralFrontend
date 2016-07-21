'use strict';

angular.module('Authorization')

.controller('AuthorizationController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {

    }
    ]
)
.controller('EditPermissionGroupsController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ConnectionService',
function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ConnectionService) {
            AuthorizationService.GetUserPermissionGroups($routeParams.id,
                function (response) {
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
                                if (response.ReturnValue.WasSelf) {
                                    ConnectionService.AddLoginError("Your permissions have changed. Please re-login.");
                                    ConnectionService.ClearCredentials();
                                    $location.path('/login');
                                }

                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );

                    };

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );

        }
    ]
);