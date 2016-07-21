'use strict';
 
angular.module('Home')
 
.factory('HomeService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
		
        service.GetHomeNews = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadNewsItems', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
		};

        service.LoadNewsItem = function (itemID, success, error) {
            return ConnectionService.RequestFromBackend('LoadNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': itemID}, success, error);
		};

        service.CreateNewsItem = function (title, paragraphs, success, error) {
            return ConnectionService.RequestFromBackend('CreateNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'Title': title, 'Paragraphs': paragraphs }, success, error);
        };

        service.UpdateNewsItem = function (newsItem, success, error) {
            return ConnectionService.RequestFromBackend('UpdateNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': newsItem.NewsItemId, 'paragraphs': newsItem.Paragraphs, 'title': newsItem.Title }, success, error);
		};

        service.DeleteNewsItem = function (itemID, success, error) {
            return ConnectionService.RequestFromBackend('DeleteNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': itemID }, success, error);
		};

        return service;
    }]);