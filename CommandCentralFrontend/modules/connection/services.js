'use strict';
 
angular.module('Connection')

.factory('ConnectionService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout',
    function (Base64, $http, $localStorage, $rootScope, $timeout) {
        var service = {};

        service.MakeConnection = function (params) {
            return function (params, success, error) {
                var reqData = { 'username': username, 'password': password, 'apikey': apikey };
                var serviceurl = service.GetBackendURL() + "/Login";
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
            }
        };

        return service;
    }]);