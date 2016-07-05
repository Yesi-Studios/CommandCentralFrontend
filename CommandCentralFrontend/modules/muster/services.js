'use strict';
 
angular.module('Muster')
 
.factory('MusterService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
        service.LoadTodaysMuster = function (success, error) {
			var reqData = {'apikey' : apikey, 'authenticationtoken' : AuthenticationService.GetAuthToken()};
			var serviceurl = AuthenticationService.GetBackendURL() + "/LoadTodaysMuster ";
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