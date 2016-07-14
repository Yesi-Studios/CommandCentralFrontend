'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService) {

        $scope.pdfUrl = "/img/pow.pdf";

        $scope.refreshNews = function () {
            $scope.dataLoading = true;
            $scope.errors = null;
            HomeService.GetHomeNews(
                function (response) {
                    $scope.dataLoading = false;
                    $scope.newsItems = response.ReturnValue;
                    $scope.loadedTime = new Date;

                },
		        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.deleteNewsItem = function (itemID) {
            $scope.dataLoading = true;
            $scope.errors = null;
            HomeService.DeleteNewsItem(itemID,
                function (response) {
                    $scope.refreshNews();

                },
		        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.userCanEditNews = function () {
            if ($rootScope.globals.currentUser && $rootScope.globals.currentUser.permissionGroups) {
                for (var i = 0; i < $rootScope.globals.currentUser.permissionGroups.length; i++) {
                    if ($rootScope.globals.currentUser.permissionGroups[i].SpecialPermissions.indexOf("ManageNews") > -1) {
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
            HomeService.CreateNewsItem(title, text.match(/[^\r\n]+/g),
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])
.controller('UpdateNewsController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService) {

        $scope.dataLoading = true;
        $scope.errors = null;
        HomeService.LoadNewsItem($routeParams.id,
            function (response) {
                $scope.dataLoading = false;
                $scope.newsItem = response.ReturnValue;
                $scope.text = $scope.newsItem.Paragraphs.join('\n');

            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
        );

        $scope.updateNewsItem = function (newsItem, text) {
            $scope.errors = null;
            $scope.dataLoading = true;
            newsItem.Paragraphs = text.match(/[^\r\n]+/g);
            HomeService.UpdateNewsItem(newsItem,
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }]);