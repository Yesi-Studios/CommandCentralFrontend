'use strict';
 
angular.module('Authorization')
 
.factory('AuthorizationService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService', 'config',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService, config) {
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
        service.CanEditFAQs = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('EditFAQ') != -1;

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

        /** @return Boolean **/
        service.CanUseWatchbillTools = function () {
            try {
                return $rootScope.globals.currentUser.permissions.HighestLevels["QuarterdeckWatchbill"]=="Command";

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

        /**
         *
         * @param {String} level
         * @returns {string|Array.<T>}
         *
         */
		service.GetReturnableFields = function(level) {
            var universalFields = $rootScope.globals.currentUser.permissions.ReturnableFields.Main.Person;
            var specificFields = $rootScope.globals.currentUser.permissions.PrivelegedReturnableFields.Main[level];
            var combinedFields = universalFields.concat(specificFields.filter(function (item) {
                return universalFields.indexOf(item) < 0;
            }));
            var levelIndex = combinedFields.indexOf(level);
            if(config.debugMode) console.log(level);
            if(config.debugMode) console.log(levelIndex);
            if( levelIndex >= 0) {
                combinedFields.splice(levelIndex, 1);
            }
			return combinedFields;
		};
 
        return service;
    }]);