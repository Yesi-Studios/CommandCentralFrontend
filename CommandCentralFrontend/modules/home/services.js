'use strict';
 
angular.module('Home')
 
.factory('HomeService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
		service.GetHomeNews = function (success, error) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken() };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadNewsItems";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        if (response.readyState != 4) {
			            error({ "ErrorType": "Authentication", "ErrorMessages": ["The service is offline. If this message persists, please contact the developers."] });
			        } else {
			            var returnContainer = JSON.parse(response.responseJSON);
			            error(returnContainer);
			        }
			    }
			});

		};

		service.LoadNewsItem = function (itemID, success, error) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid' : itemID};
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});

		};

		service.CreateNewsItem = function (title, paragraphs, success, error) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "Title": title, "Paragraphs" : paragraphs };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/CreateNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});

		};

		service.UpdateNewsItem = function (newsItem, success, error) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "newsitem": newsItem };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/UpdateNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});

		};

		service.DeleteNewsItem = function (itemID, success, error) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "newsitemid": itemID };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/DeleteNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});

		};

        return service;
    }]);