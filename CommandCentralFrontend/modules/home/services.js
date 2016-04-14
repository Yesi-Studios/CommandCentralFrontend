'use strict';
 
angular.module('Home')
 
.factory('HomeService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
		var apikey = "A114899B-DC0B-4A71-8BB8-9C65B5748B6C";
		var baseurl = "http://147.51.62.19:1113";
		
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
			        callback({ 'HasError': true, 'ErrorMessage': "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers." });
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
			        callback({ 'HasError': true, 'ErrorMessage': "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers." });
			    }
			});

		};

		service.CreateNewsItem = function (newsItem, callback) {
		    var reqData = { 'apikey': apikey, 'authenticationtoken': AuthenticationService.GetAuthToken(), "newsitem": newsItem };
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
			        callback({ 'HasError': true, 'ErrorMessage': "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers." });
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
			        callback({ 'HasError': true, 'ErrorMessage': "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers." });
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
			        callback({ 'HasError': true, 'ErrorMessage': "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers." });
			    }
			});

		};

        return service;
    }]);