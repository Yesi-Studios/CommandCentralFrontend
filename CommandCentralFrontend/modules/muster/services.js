'use strict';
 
angular.module('Muster')
 
.factory('MusterService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
        service.DoSimpleSearch = function (terms, success, error) {
			var reqData = {'apikey' : apikey, 'authenticationtoken' : AuthenticationService.GetAuthToken(), 'searchterm':terms};
			var serviceurl =  AuthenticationService.GetBackendURL() + "/SimpleSearchPersons";
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