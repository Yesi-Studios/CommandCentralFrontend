'use strict';
 
angular.module('Muster')
 
.factory('MusterService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
        
        service.LoadTodaysMuster = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadMusterablePersonsForToday', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        service.SubmitMuster = function (musterSubmissions, success, error) {
            return ConnectionService.RequestFromBackend('SubmitMuster', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'mustersubmissions': musterSubmissions }, success, error);
        };

        return service;
    }]);