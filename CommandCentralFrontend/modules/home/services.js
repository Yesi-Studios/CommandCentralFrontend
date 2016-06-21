'use strict';
 
angular.module('Home')
 
.factory('HomeService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
		service.GetHomeNews = function (callback) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken() };
		    var serviceurl = baseurl + "/LoadNewsItems";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});

		};

		service.LoadNewsItem = function (itemID, callback) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid' : itemID};
		    var serviceurl = baseurl + "/LoadNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});

		};

		service.CreateNewsItem = function (title, paragraphs, callback) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "Title": title, "Paragraphs" : paragraphs };
		    var serviceurl = baseurl + "/CreateNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});

		};

		service.UpdateNewsItem = function (newsItem, callback) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "newsitem": newsItem };
		    var serviceurl = baseurl + "/UpdateNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});

		};

		service.DeleteNewsItem = function (itemID, callback) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "newsitemid": itemID };
		    var serviceurl = baseurl + "/DeleteNewsItem";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        callback(returnContainer);
			    },
			    error: function (xhr, status, errortext) {
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        callback(returnContainer);
			    }
			});

		};

        return service;
    }]);