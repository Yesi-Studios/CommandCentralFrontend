'use strict';

angular.module('Navigation')

.controller('NavController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService) {

        $scope.resetPIIBanner = function () {
            $rootScope.containsPII = false;
        }
        $scope.canCreatePerson = function () { return AuthorizationService.CanCreatePerson(); };
        if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.permissionGroups) {
            for (var i = 0; i < $rootScope.globals.currentUser.permissionGroups.length; i++) {
                if ($rootScope.globals.currentUser.permissionGroups[i].SpecialPermissions.indexOf("CreatePerson") != -1) {
                    AuthorizationService.SetCanCreatePerson(true);

                }
            }
        }

        $scope.createNewPerson = function () {
            ProfileService.CreatePerson(
                function (response) {
                    $location.path('/profile/' + response.ReturnValue);
                    $scope.dataLoading = false;

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };


        $scope.logout = function () {
            AuthenticationService.AddLoginMessage("Succesfully logged out!");
            AuthenticationService.Logout(
                function (response) {
                    AuthenticationService.ClearCredentials();
                    $location.path('/login');

                },
			    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
        $scope.isMyProfileActive = function () {
            return $routeParams.id === AuthenticationService.GetCurrentUserID();
        }

        $scope.getMyProfileURL = function () {
            if (AuthenticationService.GetCurrentUserID()) {
                return '#/profile/' + AuthenticationService.GetCurrentUserID();
            } else {
                return null;
            }
        };

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }]);