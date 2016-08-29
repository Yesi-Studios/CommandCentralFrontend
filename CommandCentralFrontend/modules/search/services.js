'use strict';
 
angular.module('Search')
 
.factory('SearchService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
		
        service.DoSimpleSearch = function (terms, success, error) {
            return ConnectionService.RequestFromBackend('SimpleSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'searchterm': terms }, success, error);
        };
		
        service.DoAdvancedSearch = function (filters, returnFields, searchLevel, success, error) {
            return ConnectionService.RequestFromBackend('AdvancedSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'filters': filters, 'returnfields': returnFields, 'searchLevel' : searchLevel }, success, error);
        };
		
        return service;
    }]);