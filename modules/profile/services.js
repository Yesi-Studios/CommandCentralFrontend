'use strict';
 
angular.module('Profiles')
 
.factory('ProfileService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
		
        service.GetAllLists = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', {'enititynames': []}, success, error);
        };
        service.GetPermissionGroups = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadPermissionGroups', {}, success, error);
        };
		
        service.GetCommands = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'acceptcachedresults': true, 'entitynames':['Command'] }, success, error);
        };

        service.UpdateMyProfile = function (person, success, error) {
            return ConnectionService.RequestFromBackend('UpdatePerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'person': person }, success, error);
		};

        service.CreatePerson = function (success, error) {
            return ConnectionService.RequestFromBackend('CreatePerson', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
        };

        service.TakeLock = function (personid, success, error) {
            return ConnectionService.RequestFromBackend('TakeProfileLock', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
        };

        service.ReleaseLock = function (profileLockId, force, success, error) {
            return ConnectionService.RequestFromBackend('ReleaseProfileLock', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'profilelockid': profileLockId, 'forcerelease' : force }, success, error);
        };

		service.LoadProfile = function (personid, success, error) {
		    return ConnectionService.RequestFromBackend('LoadPerson', {'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
		};

        service.LoadAccountHistory = function (personid, success, error) {
            return ConnectionService.RequestFromBackend('LoadAccountHistoryByPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
        };

        service.GetChainOfCommand = function (personid, success, error) {
            return ConnectionService.RequestFromBackend('GetChainOfCommandOfPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
        };
		 
        return service;
    }]);