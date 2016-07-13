'use strict';
 
angular.module('Connection')

.factory('ConnectionService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};

        service.RequestFromBackend = function (endpoint, params, success, error) {
            var reqData = {'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': AuthenticationService.GetAPIKey() };
            for (var attrname in params) { reqData[attrname] = params[attrname];} // Merge params into our reqData

            var serviceurl = AuthenticationService.GetBackendURL() + "/" + endpoint;
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
			}
            );

        };

        return service;
    }]);