'use strict';
 
angular.module('Muster')
 
.factory('MusterService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
        
        service.LoadTodaysMuster = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadMusterablePersonsForToday', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        service.SubmitMuster = function (musterSubmissions, success, error) {
            return ConnectionService.RequestFromBackend('SubmitMuster', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'mustersubmissions': musterSubmissions }, success, error);
        };

        service.LoadMusterByDay = function (musterDate, success, error) {
            return ConnectionService.RequestFromBackend('LoadMusterRecordsByMusterDay', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'musterdate': musterDate }, success, error);
        };

        service.FinalizeMuster = function (success, error) {
            return ConnectionService.RequestFromBackend('FinalizeMuster', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        return service;
    }]);