'use strict';

angular.module('Authorization')

.controller('AuthorizationController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {

    }
    ]
)
.controller('EditPermissionGroupsController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ConnectionService', 'config',
function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ConnectionService, config) {
            AuthorizationService.GetUserPermissionGroups($routeParams.id,
                function (response) {
                    $scope.errors = [];
                    $scope.messages = [];
                    $scope.personId = $routeParams.id;
                    $scope.friendlyName = response.ReturnValue.FriendlyName;
                    $scope.allPermissionGroups = response.ReturnValue.AllPermissionGroups;
                    if(config.debugMode) console.log($scope.allPermissionGroups);
                    $scope.userPermissionGroups = response.ReturnValue.CurrentPermissionGroups;
                    if(config.debugMode) console.log($scope.userPermissionGroups);
                    $scope.editablePermissionGroups = response.ReturnValue.EditablePermissionGroups;

                    $scope.givePermissionGroup = function (group) {
                        for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                            if ($scope.userPermissionGroups[i] == group) {
                                $scope.errors.push('User already has this permission.');
                                return;
                            }
                        }
                        $scope.userPermissionGroups.push(group);
                    };

                    $scope.removePermissionGroup = function (group) {
                        for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                            if ($scope.userPermissionGroups[i] == group) {
                                $scope.userPermissionGroups.splice(i, 1);
                            }
                        }
                    };

                    $scope.canEditPermissionGroup = function (group) {
                        for (var i = 0; i < $scope.editablePermissionGroups.length; i++) {
                            if ($scope.editablePermissionGroups[i] == group) {
                                return true;
                            }
                        }
                        return false;
                    };

                    $scope.updatePermissions = function () {
                        $scope.errors = [];
                        $scope.messages = [];

                        AuthorizationService.UpdateUserPermissionGroups($routeParams.id, $scope.userPermissionGroups,
                            function (response) {
                                $scope.messages.push('Permissions successfully updated.');
                                if (response.ReturnValue.WasSelf) {
                                    ConnectionService.AddLoginError("Your permissions have changed. Please re-login.");
                                    ConnectionService.ClearCredentials();
                                    $location.path('/login');
                                }

                            }, ConnectionService.HandleServiceError($scope, $location));

                    };

                }, ConnectionService.HandleServiceError($scope, $location));

        }
    ]
);