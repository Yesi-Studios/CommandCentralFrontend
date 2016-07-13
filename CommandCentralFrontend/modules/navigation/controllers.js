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
        

		$scope.logout = function() {
			AuthenticationService.AddLoginMessage("Succesfully logged out!");
			AuthenticationService.Logout(
                function (response) {
					AuthenticationService.ClearCredentials();
						$location.path('/login');
					
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
		$scope.isMyProfileActive = function() {
			return $routeParams.id === AuthenticationService.GetCurrentUserID();
		}
		
		$scope.getMyProfileURL = function() {
			if(AuthenticationService.GetCurrentUserID()){
				return '#/profile/' + AuthenticationService.GetCurrentUserID();
			} else {
				return null;
			}
			};
		
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
    }]);