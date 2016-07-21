'use strict';

angular.module('Connection')

.factory('ConnectionService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout',
    function (Base64, $http, $localStorage, $rootScope, $timeout) {
        var service = {};

        // Information for connecting to the database, including the URL and API key.
        var apikey = "d7d82136-46ff-4047-b202-957c67fdcedc";
        //var backendURL = "http://73.20.152.170";  // Atwood's IP for working at home.
        var backendURL = "http://147.51.62.19";     // Live service IP.

        // Here we check to see if we have a port stored in localStorage, and if not, we use 1113.
        // If it's enabled, there's a widget at the bottom of index.html, controlled by this module,
        // that allows the user to set the port to look for the service on. This is for development,
        // and must be disabled before live launch.
        var backendPort;
        if ($localStorage.backendPort) {
            backendPort = $localStorage.backendPort;
        } else {
            backendPort = "1113";
        }
        // Uncomment this before release to make sure the right port is set for the end user.
        backendPort = "1113";

        // Create the base URL for all REST calls
        var baseurl = backendURL + ":" + backendPort;

        // If you can't figure out what this does, stop reading and go get an adult.
        service.GetBackendURL = function () {
            return backendURL + ":" + backendPort;
        }

        // This too.
        service.SetBackendPort = function (portnumber) {
            backendPort = portnumber;
            baseurl = backendURL + ":" + backendPort;
            $localStorage.backendPort = portnumber;
        }

        // Ditto
        service.GetAPIKey = function () {
            return apikey;
        }

        // Login page error displaying. This seems like it should be in the Authentication module, but actually this is part of backend service error handling, and
        // belongs here. Also, keeping it here prevents a circular dependancy between Authentication and Connection.

        service.AddLoginMessage = function (loginMessage) {
            if ($rootScope.globals.loginMessages) {
                $rootScope.globals.loginMessages.push(loginMessage);
            } else {
                $rootScope.globals.loginMessages = [loginMessage];
            }
        }

        service.ClearLoginMessages = function () {
            $rootScope.globals.loginMessages = [];
        }

        service.GetLoginMessages = function () {
            return $rootScope.globals.loginMessages;
        }

        service.AddLoginError = function (loginError) {
            if ($rootScope.globals.loginErrors) {
                $rootScope.globals.loginErrors.push(loginError);
            } else {
                $rootScope.globals.loginErrors = [loginError];
            }
        }

        service.ClearLoginErrors = function () {
            $rootScope.globals.loginErrors = [];
        }

        service.GetLoginErrors = function () {
            return $rootScope.globals.loginErrors;
        }


        service.ClearCredentials = function () {
            delete $rootScope.globals.currentUser;
            delete $localStorage.globals
        };

        // This is a convenience function. Just about every controller handles service errors the same way, so we just feed this
        // function the appropriate $scope and the $location service and let it handle the work. The Authentication controller has
        // a customized version of this for handling errors when we're already on the login page.
        service.HandleServiceError = function (response, scope, location) {
            // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
            // The stored credentials and kick them back to login page, displaying all appropriate error messages.
            if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                for (var i = 0; i < response.ErrorMessages.length; i++) {
                    service.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                }
                service.ClearCredentials();
                location.path('/login');
            } else {
                // If it's any other type of error, we can just show it to them on this page.
                scope.errors = response.ErrorMessages;
            }
            scope.dataLoading = false;

        }

        service.RequestFromBackend = function (endpoint, params, success, error) {
            var reqData = { 'apikey': service.GetAPIKey() };
            for (var attrname in params) { reqData[attrname] = params[attrname]; } // Merge params into our reqData

            var serviceurl = service.GetBackendURL() + "/" + endpoint; // Make the url we need

            var config = {
                method: 'POST',
                url: serviceurl,
                data: reqData,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }
            var data = JSON.stringify(reqData); // Make a string out of our data

            return $http(config).then(function (response) { // The return here is important. $http returns a promise, and the controllers need that.
                success(JSON.parse(response.data));
            },
            function (response) {
                if (response.statusText == "") {
                    error({ "ErrorType": "Authentication", "ErrorMessages": ["The service is offline. If this message persists, please contact the developers."] });
                } else {
                    error(JSON.parse(response.data));
                }
            });
        };

        return service;
    }]);