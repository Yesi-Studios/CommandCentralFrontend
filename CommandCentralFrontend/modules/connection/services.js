'use strict';
 
angular.module('Connection')

.factory('ConnectionService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout',
    function (Base64, $http, $localStorage, $rootScope, $timeout) {
        var service = {};

        var apikey = "d7d82136-46ff-4047-b202-957c67fdcedc";//"5c96c9d9-0975-4936-aecf-7fae269a7b15";//"ddaf2d5f-3014-4a60-9513-2e0715df2c02";//"768482c5-e5fb-43f2-a7f7-10c2b961fad3";//"0ab78de1-b5b5-4a07-a272-219cbd103436"; //"f6ec2c55-7571-43bb-8a6e-f1eccc76244b"; //*/"33e0e8d0-0d1c-4880-9ba7-069eea5d1210"; //"C7C6A39A-C75F-433E-A808-E8A8922ED2FC" Slightly old API Key    // "A114899B-DC0B-4A71-8BB8-9C65B5748B6C" Old API Key
        //var backendURL = "http://73.20.152.170";
        var backendURL = "http://147.51.62.19";
        var backendPort;
        if ($localStorage.backendPort) {
            backendPort = $localStorage.backendPort;
        } else {
            backendPort = "1113";
        }
        var baseurl = backendURL + ":" + backendPort;

        service.GetBackendURL = function () {
            return backendURL + ":" + backendPort;
        }

        service.SetBackendPort = function (portnumber) {
            backendPort = portnumber;
            baseurl = backendURL + ":" + backendPort;
            $localStorage.backendPort = portnumber;
        }

        service.GetAPIKey = function () {
            return apikey;
        }


        service.RequestFromBackend = function (endpoint, params, success, error) {
            var reqData = {'apikey': service.GetAPIKey()};
            for (var attrname in params) { reqData[attrname] = params[attrname];} // Merge params into our reqData

            var serviceurl = service.GetBackendURL() + "/" + endpoint;

            // This is what we should be able to do, but we get a 405:
            
            var data = JSON.stringify(reqData);

            var config = {
                method: 'POST',
                url: serviceurl,
                data: data,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }
            var maybe = $http(config).then(function (response) {
                console.log(response);
                success(JSON.parse(response.data));
            }, error);/**/
            console.log(maybe);
            return maybe;
            

            // So instead, we do this. This requires the $scope.$apply() stuff we have everywhere, which sucks.
            /*return $.ajax(
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
            );/**/

        };

        return service;
    }]);