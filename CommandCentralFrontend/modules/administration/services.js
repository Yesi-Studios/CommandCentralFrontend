'use strict';
 
angular.module('Administration')
 
.factory('AdministrationService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};

        service.LoadEditableLists = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', {'editable':true}, success, error);
        };

        service.AddListItem = function (listname, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': listname, 'item': {'value': value, 'description': description} }, success, error);
        };

        service.EditListItem = function (listitemid, value, description, listname, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':listname, 'item': {'value': value, 'description': description, 'id': listitemid } }, success, error);
        };

        service.DeleteListItem = function (listitemid, listname, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'forcedelete' : forcedelete, 'entityname':listname, 'id': listitemid }, success, error);
        };


        service.LoadCommands = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Command'] }, success, error);
        };

        service.AddCommand = function (value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': 'Command', 'item': {'value': value, 'description': description }}, success, error);
        };

        service.EditCommand = function (commandid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': 'Command', 'id': commandid, 'item': {'value': value, 'description': description,  'id': commandid} }, success, error);
        };

        service.DeleteCommand = function (commandid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': 'Command', 'forcedelete': forcedelete, 'id': commandid }, success, error);
        };

        service.LoadCommand = function (commandid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Command'], 'id' : commandid }, success, error);
        };


        service.LoadDepartments = function (commandid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Department'], 'commandid' : commandid }, success, error);
        };

        service.AddDepartment = function (commandid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Department', 'item': {'commandid': commandid, 'value': value, 'description': description }}, success, error);
        };

        service.EditDepartment = function (commandid, departmentid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Department', 'item': {'value': value, 'description': description, 'id': departmentid, 'commandid':commandid} }, success, error);
        };

        service.DeleteDepartment = function (departmentid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname' :'Department', 'forcedelete': forcedelete, 'id': departmentid }, success, error);
        };

        service.LoadDepartment = function (departmentid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Department'], 'id': departmentid }, success, error);
        };

        service.LoadDivisions = function (departmentid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Division'], 'departmentid': departmentid }, success, error);
        };

        service.AddDivision = function (departmentid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Division', 'item': {'departmentid': departmentid, 'value': value, 'description': description }}, success, error);
        };

        service.EditDivision = function (departmentid, divisionid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Division', 'item': {'value': value, 'description': description, 'id': divisionid, 'departmentid':departmentid} }, success, error);
        };

        service.DeleteDivision = function (divisionid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname' :'Division', 'forcedelete': forcedelete, 'id': divisionid }, success, error);
        };

        service.LoadDivision = function (divisionid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Division'], 'id': divisionid }, success, error);
        };
      
        return service;
    }]);