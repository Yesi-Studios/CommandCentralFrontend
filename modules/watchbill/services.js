/**
 * Created by Angus on 3/20/2017.
 */
'use strict';

angular.module('Watchbill')

    .factory('WatchbillService',
        ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
            function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
                var service = {};

                service.PopulateWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {'watchbillId': id, 'dopopulation': true, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {'watchbillId': id, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchbill = function (title, eligibilityGroup, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchbill', {'watchbill': {'title': title, 'eligibilityGroup':  eligibilityGroup}, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.UpdateWatchbill = function (watchbill, success, error) {
                    return ConnectionService.RequestFromBackend('UpdateWatchbill', {'watchbill': watchbill, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchbill', {'watchbill': {'id': id}, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadWatchbills = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbills', {'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchShift = function (shift, watchbillid, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchShift', {'watchshifts': [shift], 'watchbillid':  watchbillid, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchShifts = function (shifts, watchbillid, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchShifts', {'watchshifts': shifts, 'watchbillid':  watchbillid, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchDay = function (day, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchDay', {'watchday': day, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchDays = function (days, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchDays', {'watchdays': days, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchInput = function (person, shifts, reason, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchInputs', {'watchinputs': [{'person': person , 'WatchShifts': shifts, 'InputReason': reason}], 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.UpdateWatchInput = function (input, success, error) {
                    return ConnectionService.RequestFromBackend('UpdateWatchInput', {'watchinput': input, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchDay = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchDay', {'watchday': {'Id': id}, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchDays = function (days, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchDays', {'watchdays': days, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.GetAllLists = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadReferenceLists', {'enititynames': []}, success, error);
                };

                service.GetSubordinatePersons = function (filter, value, success, error) {
                    var filters = {};
                    filters[filter] = value;
                    return ConnectionService.RequestFromBackend('AdvancedSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'filters': filters, 'returnfields': ['Id'], 'searchLevel' : 'Command'}, success, error);
                };

                return service;
            }]);