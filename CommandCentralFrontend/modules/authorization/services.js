'use strict';
 
angular.module('Authorization')
 
.factory('AuthorizationService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};

        service.GetUserPermissionGroups = function (personid, success, error) {
            return ConnectionService.RequestFromBackend('LoadPermissionGroupsByPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
        };

        service.UpdateUserPermissionGroups = function (personid, groups, success, error) {
            return ConnectionService.RequestFromBackend('UpdatePermissionGroupsByPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid, 'permissiongroups': groups }, success, error);
        };

        service.GetPersonMetadata = function (success, error) {
            return ConnectionService.RequestFromBackend('GetPersonMetadata', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };
		
        service.GetPermissionGroups = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadPermissionGroups', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        /** @return Boolean **/
        service.CanCreatePerson = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('CreatePerson') != -1;

            } catch (err){
                return false;
            }
        };

        /** @return Boolean **/
        service.CanEditNews = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('EditNews') != -1;

            } catch (err){
                return false;
            }
        };

        /** @return Boolean **/
        service.CanUseAdminTools = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('AdminTools') != -1;

            } catch (err){
                return false;
            }
        };

        service.SetPermissions = function (newPermissions) {
            $rootScope.globals.currentUser.permissions = newPermissions;
 
            $localStorage.globals = $rootScope.globals;
        };
		
		service.SetPermissionGroups = function (permsGroupArray) {
            $rootScope.globals.currentUser.permissionGroups = permsGroupArray;

            $localStorage.globals = $rootScope.globals;
        };
		
		service.GetSearchableFields = function() {
			return $rootScope.globals.currentUser.permissions.ReturnableFields.Main.Person;
		};
		
		service.GetReturnableFields = function() {
			return $rootScope.globals.currentUser.permissions.ReturnableFields.Main.Person;
		};

 
        return service;
    }]);