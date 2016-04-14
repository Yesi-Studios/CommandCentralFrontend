'use strict';
 
angular.module('Home')
 
.controller('HomeController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService) {
		
		$scope.pdfUrl = "/img/pow.pdf";
		
		$scope.refreshNews = function(){
			$scope.dataLoading = true;
			$scope.error = "";
			HomeService.GetHomeNews(function(response) {
				if(!response.HasError) {
                    $scope.$apply(function() {
						$scope.dataLoading = false;
						$scope.newsItems = response.ReturnValue;
						$scope.loadedTime = new Date;
					});
                } else {
					$scope.$apply(function() {
						$scope.error = "News failed to refresh: " + response.ErrorMessage;
						$scope.dataLoading = false;
						AuthenticationService.AddLoginError("News failed to refresh: " + response.ErrorMessage);
						$location.path('/login');
					});
				}
			});
		};

		$scope.userCanEditNews = function () {
		    for (var i = 0; i < $rootScope.globals.currentUser.permissionGroups.length; i++) {
		        if ($rootScope.globals.currentUser.permissionGroups[i].CustomPermissions.indexOf("Manage_News") > -1) {
		            return true;
		        }
		    }
		    return false;
		};
		
		$scope.refreshNews();
		
    }])

.controller('CreateNewsController', ['$scope', '$rootScope', 'AuthenticationService', 'HomeService',
    function ($scope, $rootScope, AuthenticationService, HomeService) {

    }]);