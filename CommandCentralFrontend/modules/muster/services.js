'use strict';
 
angular.module('Muster')
 
.factory('MusterService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
		
        service.DoSimpleSearch = function (terms, success, error) {
            return ConnectionService.RequestFromBackend('SimpleSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'searchterm': terms }, success, error);

        };		
		
        return service;
    }]);