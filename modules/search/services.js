'use strict';
 
angular.module('Search')
 
.factory('SearchService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};

        service.GetFieldTypes = function (success, error) {
            return ConnectionService.RequestFromBackend('GetPersonMetaData', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
        };

        service.DoSimpleSearch = function (terms, showHidden, success, error) {
            return ConnectionService.RequestFromBackend('SimpleSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'searchterm': terms, 'showhidden': showHidden }, success, error);
        };
		
        service.DoAdvancedSearch = function (filters, returnFields, searchLevel, showHidden, success, error) {
            if ( returnFields.indexOf("Id") < 0 ) returnFields.push('Id');
            return ConnectionService.RequestFromBackend('AdvancedSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'filters': filters, 'returnfields': returnFields, 'searchLevel' : searchLevel, 'showhidden': showHidden }, success, error);
        };
		
        return service;
    }]);