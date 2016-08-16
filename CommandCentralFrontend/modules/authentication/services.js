'use strict';
 
angular.module('Authentication')
 
.factory('AuthenticationService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, ConnectionService) {
        var service = {};

        /**
         * Calls the Login endpoint
         * @param {String} username
         * @param {String} password
         * @param {Function} success
         * @param {Function} error
         */
        service.Login = function (username, password, success, error) {
            return ConnectionService.RequestFromBackend('Login', { 'username': username, 'password': password }, success, error);
        };

        /**
         *
         * @param {Function} success
         * @param {Function} error
         */
		service.Logout = function (success, error) {
		    return ConnectionService.RequestFromBackend('Logout', { 'authenticationtoken': service.GetAuthToken()}, success, error);
		};

        /**
         *
         * @param {String} username
         * @param {String} password
         * @param {String} id
         * @param {Function} success
         * @param {Function} error
         * @constructor
         */
		service.FinishRegistration = function (username, password, id, success, error) {
		    return ConnectionService.RequestFromBackend('CompleteRegistration', { 'username': username, 'password': password, 'accountconfirmationid': id }, success, error);
		};

		service.BeginRegistration = function (ssn, success, error) {
		    return ConnectionService.RequestFromBackend('BeginRegistration', { 'ssn': ssn }, success, error);
		};

		service.CreateUser = function (person, success, error) {
		    return ConnectionService.RequestFromBackend('CreatePerson', { 'authenticationtoken': service.GetAuthToken(), 'person': person }, success, error);
		};
		
		service.ForgotPassword = function (email, ssn, success, error) {
		    return ConnectionService.RequestFromBackend('BeginPasswordReset', { 'email': email, 'ssn': ssn }, success, error);
		};
		
		service.FinishReset = function (password, id, success, error) {
		    return ConnectionService.RequestFromBackend('CompletePasswordReset', { 'PasswordResetid': id, 'Password': password }, success, error);
		};
		
        service.SetCredentials = function (username, authtoken, userID) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authtoken: authtoken,
					userID: userID
                }
            };
 
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $localStorage.globals = $rootScope.globals;
        };
 
        service.ClearCredentials = function () {
            delete $rootScope.globals.currentUser;
            delete $localStorage.globals;
            //$http.defaults.headers.common.Authorization = 'Basic ';
        };

        /**
         * @return {String}
         */
        service.GetAuthToken = function () {
			if( $localStorage.globals && $localStorage.globals.currentUser && $localStorage.globals.currentUser.authtoken){
				return $localStorage.globals.currentUser.authtoken;
			} else {
				return null;
			}
				
		};

        /**
         * @return {Object}
         */
        service.GetCurrentUserID = function () {
		    if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.userID) {
				return $rootScope.globals.currentUser.userID;
			} else {
				return null;
			}
		
		};
 
        return service;
    }]);