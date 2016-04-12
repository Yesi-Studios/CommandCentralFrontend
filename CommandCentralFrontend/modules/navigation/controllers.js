'use strict';
 
angular.module('Navigation')
 
.controller('NavController',
    ['$scope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $location, $routeParams, AuthenticationService) {
		
		$scope.logout = function() {
			AuthenticationService.AddLoginMessage("Succesfully logged out!");
			AuthenticationService.Logout(function(response) {
					if(!response.HasError) {
						AuthenticationService.ClearCredentials();
						$scope.$apply(function() {
							$location.path('/login');
						});
					} else {
						AuthenticationService.ClearCredentials();
						$scope.$apply(function() {
							$scope.error = response.ErrorMessage;
							$scope.dataLoading = false;
							$location.path('/login');
						});
					}
				});
			};
		$scope.isMyProfileActive = function() {
			return $routeParams.id === AuthenticationService.GetCurrentUserID();
		}
		
		$scope.myProfileUrl = '#/profile/' + AuthenticationService.GetCurrentUserID();
		
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
    }]);