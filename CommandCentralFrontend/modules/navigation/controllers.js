'use strict';

angular.module('Navigation')

.controller('NavController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService) {

        $scope.resetPIIBanner = function () {
            $rootScope.containsPII = false;
        };

        $scope.canCreatePerson = function () { return AuthorizationService.CanCreatePerson(); };
        $scope.canUseAdminTools = function () { return AuthorizationService.CanUseAdminTools(); };

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
            ConnectionService.AddLoginMessage("Succesfully logged out!");
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

        $scope.canFinalizeMuster = function () {
            // Implement this properly.
            return true;
        };

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }]);