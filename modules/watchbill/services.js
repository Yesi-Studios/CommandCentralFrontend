/**
 * Created by Angus on 3/20/2017.
 */
'use strict';

angular.module('Watchbill')

    .factory('WatchbillService',
        ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
            function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
                /**
                 * The callback for backend requests
                 * @callback responseCallback
                 * @param {Object} response - The response from the backend request
                 */

                var service = {};

                service.PopulateWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {'Id': id, 'dopopulation': true, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {'Id': id, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchbill = function (title, eligibilityGroup, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchbill', {'title': title, 'eligibilityGroupId':  eligibilityGroup.Id, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.UpdateWatchbill = function (watchbill, success, error) {
                    return ConnectionService.RequestFromBackend('UpdateWatchbillState', {'Id': watchbill.Id, 'stateId': watchbill.CurrentState.Id, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchbill', {'id': id, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadWatchbills = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbills', {'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchShift = function (shift, watchbillid, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchShift', {'watchshifts': [shift], 'watchbillid':  watchbillid, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.SwapWatchAssignments = function (firstId, secondId, success, error) {
                    return ConnectionService.RequestFromBackend('SwapWatchAssignments', {'Id1': firstId, 'Id2': secondId, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchShifts = function (shifts, watchbillid, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchShifts', {'watchshifts': shifts, 'watchbillid':  watchbillid, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchDay = function (day, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchDay', {'watchday': day, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchDays = function (days, watchbillId, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchDays', {'watchdays': days, 'watchbillId': watchbillId, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchInput = function (person, shifts, reason, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchInputs', {'watchinputs': [{'person': person , 'WatchShifts': shifts, 'InputReason': reason}], 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchAssignments = function (assignments, watchbillId, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchAssignments', {'watchassignments': assignments, 'watchbillId': watchbillId, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.ConfirmWatchInput = function (inputId, success, error) {
                    return ConnectionService.RequestFromBackend('ConfirmWatchInput', {'Id': inputId, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadWatchInputs = function (watchbillId, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchInputs', {'watchbillId': watchbillId, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchInput = function (inputId, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchInput', {'Id': inputId, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchDay = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchDay', {'watchday': {'Id': id}, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                /**
                 * Make a request to the backend to change the membership of an eligibility group.
                 * @param {string} id - The Id of the eligibility group
                 * @param {string[]} personIds - The Ids of people that are in that eligibility group
                 * @param {responseCallback} success - The callback if the request succeeds
                 * @param {responseCallback} error - The callback if the request fails
                 */
                service.EditWatchEligibilityGroup = function (id, personIds, success, error) {
                    return ConnectionService.RequestFromBackend('EditWatchEligibilityGroupMembership', {'Id': id, 'PersonIds': personIds, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.DeleteWatchDays = function (watchdayIds, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchDays', {'Ids': watchdayIds, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                /**
                 * Get all reference lists from the backend
                 * @param {responseCallback} success - The callback if the request succeeds
                 * @param {responseCallback} error - The callback if the request fails
                 */
                service.GetAllLists = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadReferenceLists', {'enititynames': []}, success, error);
                };

                service.GetSubordinatePersons = function (filter, value, success, error) {
                    var filters = {};
                    filters[filter] = value;
                    return ConnectionService.RequestFromBackend('AdvancedSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'filters': filters, 'returnfields': ['Id'], 'searchLevel' : 'Command'}, success, error);
                };

                /**
                 * Get all people in the command
                 * @param {responseCallback} success - The callback if the request succeeds
                 * @param {responseCallback} error - The callback if the request fails
                 */
                service.GetAllPeople = function (success, error) {
                    return ConnectionService.RequestFromBackend('AdvancedSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'filters': null, 'returnfields': ['Id', 'FirstName', 'LastName', 'MiddleName'], 'searchLevel' : 'Command'}, success, error);
                };

                return service;
            }]);