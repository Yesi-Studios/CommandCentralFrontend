'use strict';
 
angular.module('Home')
 
.controller('HomeController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService) {
		
		$scope.pdfUrl = "/img/pow.pdf";

		$scope.refreshNews = function () {
		    $scope.dataLoading = true;
		    $scope.error = "";
		    HomeService.GetHomeNews(function (response) {
		        if (!response.HasError) {
		            $scope.$apply(function () {
		                $scope.dataLoading = false;
		                $scope.newsItems = response.ReturnValue;
		                $scope.loadedTime = new Date;
		            });
		        } else {
		            $scope.$apply(function () {
		                $scope.error = "News failed to refresh: " + response.ErrorMessage;
		                $scope.dataLoading = false;
		                AuthenticationService.AddLoginError("News failed to refresh: " + response.ErrorMessage);
		                $location.path('/login');
		            });
		        }
		    });
		};

		$scope.deleteNewsItem = function (itemID) {
		    $scope.dataLoading = true;
		    $scope.error = "";
		    HomeService.DeleteNewsItem(itemID, function (response) {
		        if (!response.HasError) {
		            $scope.$apply(function () {
		                $scope.refreshNews();
		            });
		        } else {
		            $scope.$apply(function () {
		                $scope.error = "Failed to delete item: " + response.ErrorMessage;
		                $scope.dataLoading = false;
		                $scope.refreshNews();
		            });
		        }
		    });
		};

		$scope.userCanEditNews = function () {
		    if ($rootScope.globals.currentUser && $rootScope.globals.currentUser.permissionGroups) {
		        for (var i = 0; i < $rootScope.globals.currentUser.permissionGroups.length; i++) {
		            if ($rootScope.globals.currentUser.permissionGroups[i].CustomPermissions.indexOf("Manage_News") > -1) {
		                return true;
		            }
		        }
		    }
		    return false;
		};
		
		$scope.refreshNews();
		
    }])

.controller('CreateNewsController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'HomeService',
    function ($scope, $rootScope, $location, AuthenticationService, HomeService) {
        $scope.saveNewsItem = function (title, text) {
            HomeService.CreateNewsItem({ "Title": title, "Paragraphs": text.match(/[^\r\n]+/g) }, function (response) {
                if (!response.HassError) {
                    $scope.$apply(function () {
                        $scope.dataLoading = false;
                        $location.path('/');
                    })
                } else {
                    $scope.$apply(function () {
                        $scope.error = "News item not saved: " + response.ErrorMessage;
                        $scope.dataLoading = false;
                    })
                }
            })
        };
    }])
.controller('UpdateNewsController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService) {

        $scope.dataLoading = true;
        $scope.error = "";
        HomeService.LoadNewsItem($routeParams.id, function (response) {
            if (!response.HasError) {
                $scope.$apply(function () {
                    $scope.dataLoading = false;
                    $scope.newsItem = response.ReturnValue;
                    $scope.newsItem.Text = $scope.newsItem.Paragraphs.join('\n');
                });
            } else {
                $scope.$apply(function () {
                    $scope.error = "Item failed to load: " + response.ErrorMessage;
                    $scope.dataLoading = false;
                });
            }
        });

        $scope.updateNewsItem = function (id, title, text) {
            HomeService.UpdateNewsItem({"ID" : id, "Title": title, "Paragraphs": text.match(/[^\r\n]+/g) }, function (response) {
                if (!response.HasError) {
                    $scope.$apply(function () {
                        $scope.dataLoading = false;
                        $location.path('/');
                    })
                } else {
                    $scope.$apply(function () {
                        $scope.error = "News item not saved: " + response.ErrorMessage;
                        $scope.dataLoading = false;
                    })
                }
            })
        };
    }]);