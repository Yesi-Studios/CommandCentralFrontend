'use strict';
 
angular.module('Navigation')
 
.controller('NavController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService) {
		
        $scope.resetPIIBanner = function () {
            $rootScope.containsPII = false;
        }

        $scope.createNewPerson = function () {
            ProfileService.CreatePerson(function(response) {
                if(!response.HasError) {
                    $scope.$apply(function() {
                        $location.path('/profile/' + response.ReturnValue);
                        $scope.dataLoading = false;
                    });
                } else {
                    AuthenticationService.ClearCredentials();
                    $scope.$apply(function() {
                        $scope.error = response.ErrorMessage;
                        AuthenticationService.AddLoginMessage(response.ErrorMessage);
                        $scope.dataLoading = false;
                        $location.path('/login');
                    });
                }
            });
        };
        

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