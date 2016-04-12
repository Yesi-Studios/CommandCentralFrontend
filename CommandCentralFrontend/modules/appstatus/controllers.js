'use strict';
 
angular.module('AppStatus')
 
.controller('AppStatusController',
    ['$scope', 'AppStatusService', 'AuthenticationService',
    function ($scope, AppStatusService, AuthenticationService) {
		
		$scope.refreshNews = function(){
			$scope.dataLoading = true;
			$scope.error = "";
			AppStatusService.GetAppStatus(function(response) {
				if(!response.HasError) {
                    $scope.$apply(function() {
						$scope.changes = response.ReturnValue.ChangeLog;
						$scope.issues = response.ReturnValue.KnownIssues;
						$scope.backendVersion = response.ReturnValue.Version;
						$scope.statusUpdateTime = response.ReturnValue.Time;
						$scope.loadedTime = new Date;
						$scope.dataLoading = false;
					});
                } else {
					$scope.$apply(function() {
						AuthenticationService.ClearCredentials();
						$scope.$apply(function() {
							$scope.error = response.ErrorMessage;
							$scope.dataLoading = false;
							AuthenticationService.AddLoginError("Changes and know issues caused an error: " + response.ErrorMessage);
							$location.path('/login');
						});
					});
				}
			});
		};
		
		$scope.refreshNews();
    }]);