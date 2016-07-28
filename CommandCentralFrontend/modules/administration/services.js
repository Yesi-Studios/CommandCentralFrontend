'use strict';
 
angular.module('Administration')
 
.factory('AdministrationService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};

        service.LoadEditableLists = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadEditableLists', {}, success, error);
        };

        service.AddListItem = function (listname, value, description, success, error) {
            return ConnectionService.RequestFromBackend('AddListItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'listname': listname, 'value': value, 'description': description }, success, error);
        };

        service.EditListItem = function (listitemid, value, description, listname, success, error) {
            return ConnectionService.RequestFromBackend('EditListItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'listname':listname, 'listitemid': listitemid, 'value': value, 'description': description }, success, error);
        };

        service.DeleteListItem = function (listitemid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteListItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'forcedelete' : forcedelete, 'listitemid': listitemid }, success, error);
        };

      
        return service;
    }]);