'use strict';
 
angular.module('Administration')
 
.factory('AdministrationService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
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


        service.LoadCommands = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadCommands', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        service.AddCommand = function (value, description, success, error) {
            return ConnectionService.RequestFromBackend('AddCommand', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'value': value, 'description': description }, success, error);
        };

        service.EditCommand = function (commandid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('EditCommand', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'commandid': commandid, 'value': value, 'description': description }, success, error);
        };

        service.DeleteCommand = function (commandid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteCommand', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'forcedelete': forcedelete, 'commandid': commandid }, success, error);
        };

        service.LoadCommand = function (commandid, success, error) {
            return ConnectionService.RequestFromBackend('LoadCommand', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'commandid' : commandid }, success, error);
        };


        service.LoadDepartments = function (commandid, success, error) {
            return ConnectionService.RequestFromBackend('LoadDepartmentsByCommand', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'commandid': commandid }, success, error);
        };

        service.AddDepartment = function (commandid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('AddDepartment', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'commandid': commandid, 'value': value, 'description': description }, success, error);
        };

        service.EditDepartment = function (departmentid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('EditDepartment', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'departmentid': departmentid, 'value': value, 'description': description }, success, error);
        };

        service.DeleteDepartment = function (departmentid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteDepartment', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'forcedelete': forcedelete, 'departmentid': departmentid }, success, error);
        };

        service.LoadDepartment = function (departmentid, success, error) {
            return ConnectionService.RequestFromBackend('LoadDepartment', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'departmentid': departmentid }, success, error);
        };


        service.LoadDivisions = function (departmentid, success, error) {
            return ConnectionService.RequestFromBackend('LoadDivisionsByDepartment', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'departmentid': departmentid }, success, error);
        };

        service.AddDivision = function (departmentid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('AddDivision', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'departmentid': departmentid, 'value': value, 'description': description }, success, error);
        };

        service.EditDivision = function (divisionid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('EditDivision', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'divisionid': divisionid, 'value': value, 'description': description }, success, error);
        };

        service.DeleteDivision = function (divisionid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteDivision', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'forcedelete': forcedelete, 'divisionid': divisionid }, success, error);
        };

        service.LoadDivision = function (divisionid, success, error) {
            return ConnectionService.RequestFromBackend('LoadDivision', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'divisionid': divisionid }, success, error);
        };
      
        return service;
    }]);