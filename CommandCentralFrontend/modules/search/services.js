'use strict';
 
angular.module('Search')
 
.factory('SearchService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
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
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
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
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    callback(returnContainer);
				}
			});

        };
		
        return service;
    }]);