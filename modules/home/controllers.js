'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'HomeService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, HomeService, ConnectionService, config) {

        $scope.refreshNews = function () {
            $scope.dataLoading = true;
            $scope.errors = null;
            HomeService.GetHomeNews(
                function (response) {
                    $scope.dataLoading = false;
                    $scope.newsItems = response.ReturnValue;
                    $scope.loadedTime = new Date;
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.deleteNewsItem = function (itemID) {
            $scope.dataLoading = true;
            $scope.errors = null;
            HomeService.DeleteNewsItem(itemID,
                function (response) {
                    $scope.refreshNews();

                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.userCanEditNews = function () { return AuthorizationService.CanEditNews(); };
        $scope.refreshNews();

    }])

.controller('CreateNewsController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'HomeService', 'ConnectionService',
    function ($scope, $rootScope, $location, AuthenticationService, HomeService, ConnectionService) {
        $scope.saveNewsItem = function (title, text) {
            HomeService.CreateNewsItem(title, text.match(/[^\r\n]+/g),
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/');

                }, ConnectionService.HandleServiceError($scope, $location));
        };
    }])
.controller('UpdateNewsController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService, ConnectionService) {

        $scope.dataLoading = true;
        $scope.errors = null;
        HomeService.LoadNewsItem($routeParams.id,
            function (response) {
                $scope.dataLoading = false;
                $scope.newsItem = response.ReturnValue;
                $scope.text = $scope.newsItem.Paragraphs.join('\n');

            }, ConnectionService.HandleServiceError($scope, $location));

        $scope.updateNewsItem = function (newsItem, text) {
            $scope.errors = null;
            $scope.dataLoading = true;
            var newsItemDTO = {};
            newsItemDTO.Paragraphs = text.match(/[^\r\n]+/g);
            newsItemDTO.Title = newsItem.Title;
            newsItemDTO.NewsItemId = newsItem.Id;
            HomeService.UpdateNewsItem(newsItemDTO,
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/');

                }, ConnectionService.HandleServiceError($scope, $location));
        };
    }]);