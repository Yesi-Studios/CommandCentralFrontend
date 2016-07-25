'use strict';
 
angular.module('Administration')
 
.factory('AdministrationService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, ConnectionService) {
        var service = {};

        service.LoadLists = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadLists', {}, success, error);
        };

        service.AddListItem = function (listname, value, description, success, error) {
            return ConnectionService.RequestFromBackend('AddListItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'listname': listname, 'value': value, 'description': description }, success, error);
        };

        service.EditListItem = function (listitemid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('EditListItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'listitemid': listitemid, 'value': value, 'description': description }, success, error);
        };

        service.DeleteListItem = function (listitemid, success, error) {
            return ConnectionService.RequestFromBackend('DeleteListItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'listitemid': listitemid }, success, error);
        };

      
        return service;
    }]);