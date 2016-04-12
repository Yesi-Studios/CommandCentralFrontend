'use strict';
 
angular.module('Search')
 
.factory('SearchService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
		var apikey = "A114899B-DC0B-4A71-8BB8-9C65B5748B6C";
		var baseurl = "http://147.51.62.19:1113";
		
        service.DoSimpleSearch = function (terms, callback) {
			var reqData = {'apikey' : apikey, 'authenticationtoken' : AuthenticationService.GetAuthToken(), 'searchterm':terms};
			var serviceurl = baseurl + "/SimpleSearchPersons";
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
					callback({'HasError': true, 'ErrorMessage' : "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers."});
				}
			});

        };
		
		service.DoAdvancedSearch = function (filters, returnFields, callback) {
			var reqData = {'apikey' : apikey, 'authenticationtoken' : AuthenticationService.GetAuthToken(), 'filters' : filters, 'returnfields' : returnFields};
			var serviceurl = baseurl + "/AdvancedSearchPersons";
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
					callback({'HasError': true, 'ErrorMessage' : "Unable to communicate with server. Please try again shortly. If this problem persists, please contact the developers."});
				}
			});

        };
		
        return service;
    }]);