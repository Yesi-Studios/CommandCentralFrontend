/**
 * Created by Angus on 3/20/2017.
 */
'use strict';

angular.module('Watchbill')

    .factory('WatchbillService',
        ['$http', '$localStorage', '$rootScope', '$timeout', '$filter', 'AuthenticationService', 'ConnectionService',
            function ($http, $localStorage, $rootScope, $timeout, $filter, AuthenticationService, ConnectionService) {
                /**
                 * The callback for backend requests
                 * @callback responseCallback
                 * @param {Object} response - The response from the backend request
                 */

                var service = {};

                service.PopulateWatchbill = function (id, success, error) {
                    var successWrapper = function (response) {
                        response.ReturnValue = fixWatchbill(response.ReturnValue);
                        success(response);
                    };
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {
                        'Id': id,
                        'dopopulation': true,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, successWrapper, error);
                };

                service.LoadWatchbill = function (id, success, error) {
                    var successWrapper = function (response) {
                        response.ReturnValue = fixWatchbill(response.ReturnValue);
                        success(response);
                    };
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {
                        'Id': id,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, successWrapper, error);
                };

                service.CreateWatchbill = function (title, eligibilityGroup, begin, end, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchbill', {
                        'title': title,
                        'range': {
                            'Start': begin,
                            'End': end
                        },
                        'eligibilityGroupId': eligibilityGroup.Id,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.UpdateWatchbill = function (watchbill, success, error) {
                    return ConnectionService.RequestFromBackend('UpdateWatchbillState', {
                        'Id': watchbill.Id,
                        'stateId': watchbill.CurrentState.Id,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.DeleteWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchbill', {
                        'id': id,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.LoadWatchbills = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbills', {'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.CreateWatchShift = function (shift, watchbillid, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchShift', {
                        'watchshifts': [shift],
                        'watchbillid': watchbillid,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.SwapWatchAssignments = function (firstId, secondId, success, error) {
                    return ConnectionService.RequestFromBackend('SwapWatchAssignments', {
                        'Id1': firstId,
                        'Id2': secondId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.CreateWatchShifts = function (shifts, watchbillid, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchShifts', {
                        'watchshifts': shifts,
                        'watchbillid': watchbillid,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.CreateWatchDay = function (day, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchDay', {
                        'watchday': day,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.CreateWatchDays = function (days, watchbillId, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchDays', {
                        'watchdays': days,
                        'watchbillId': watchbillId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                /**
                 * Call to the backend to create a watch input.
                 * @param {Object} person - The person who this input is for
                 * @param {string} watchbillId - The id of the watchbill
                 * @param {Object} reason - The justification for not standing watch
                 * @param {Date} start - The beginning of the input period
                 * @param {Date} end - The end of the input period
                 * @param success - A callback for when the call succeeds
                 * @param error - A callback for when the call fails
                 */
                service.CreateWatchInput = function (person, watchbillId, reason, start, end, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchInputs', {
                        WatchBillId: watchbillId,
                        watchinputs: [{
                            person: person,
                            InputReason: reason,
                            Range: {
                                Start: start,
                                End: end
                            }
                        }], 'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.CreateWatchAssignments = function (assignments, watchbillId, success, error) {
                    return ConnectionService.RequestFromBackend('CreateWatchAssignments', {
                        'watchassignments': assignments,
                        'watchbillId': watchbillId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.AnswerInputRequirement = function (watchbillId, personId, success, error) {
                    return ConnectionService.RequestFromBackend('AnswerInputRequirement', {
                        'watchbillid': watchbillId,
                        'personid': personId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.ConfirmWatchInput = function (inputId, success, error) {
                    return ConnectionService.RequestFromBackend('ConfirmWatchInput', {
                        'Id': inputId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.LoadWatchInputs = function (watchbillId, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchInputs', {
                        'watchbillId': watchbillId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.DeleteWatchInput = function (inputId, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchInput', {
                        'Id': inputId,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                // service.DeleteWatchDay = function (id, success, error) {
                //     return ConnectionService.RequestFromBackend('DeleteWatchDay', {
                //         'watchday': {'Id': id},
                //         'authenticationtoken': AuthenticationService.GetAuthToken()
                //     }, success, error);
                // };

                /**
                 * Make a request to the backend to change the membership of an eligibility group.
                 * @param {string} id - The Id of the eligibility group
                 * @param {string[]} personIds - The Ids of people that are in that eligibility group
                 * @param {responseCallback} success - The callback if the request succeeds
                 * @param {responseCallback} error - The callback if the request fails
                 */
                service.EditWatchEligibilityGroup = function (id, personIds, success, error) {
                    return ConnectionService.RequestFromBackend('EditWatchEligibilityGroupMembership', {
                        'Id': id,
                        'PersonIds': personIds,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.DeleteWatchShifts = function (watchShiftIds, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteWatchShifts', {
                        'Ids': watchShiftIds,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.AcknowledgeWatchAssignment = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('AcknowledgeWatchAssignment', {
                        'id': id,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
                };

                service.LoadAcknowledgeableWatchAssignemnts = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('LoadAcknowledgeableWatchAssignments', {
                        'watchbillid': id,
                        'authenticationtoken': AuthenticationService.GetAuthToken()
                    }, success, error);
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
                    return ConnectionService.RequestFromBackend('AdvancedSearchPersons', {
                        'authenticationtoken': AuthenticationService.GetAuthToken(),
                        'filters': filters,
                        'returnfields': ['Id'],
                        'searchLevel': 'Command'
                    }, success, error);
                };

                /**
                 * Get all people in the command
                 * @param {responseCallback} success - The callback if the request succeeds
                 * @param {responseCallback} error - The callback if the request fails
                 */
                service.GetAllPeople = function (success, error) {
                    return ConnectionService.RequestFromBackend('AdvancedSearchPersons', {
                        'authenticationtoken': AuthenticationService.GetAuthToken(),
                        'filters': null,
                        'returnfields': ['Id', 'FirstName', 'LastName', 'MiddleName', 'Paygrade'],
                        'searchLevel': 'Command'
                    }, success, error);
                };

                service.GetRecommendations = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('GetWatchRecommendations', {
                        'authenticationtoken': AuthenticationService.GetAuthToken(),
                        'watchbillid': id
                    }, success, error);
                };

                service.GetDefaultWatchShifts = function (theDay) {
                    var dayOfWeek = theDay.Date.getDay();
                    var joodShift = {"Id": "858f6b78-5508-4a59-97a0-6e45aadab2a9"};
                    var oodShift = {"Id": "f3f818f8-55d3-45dc-af2f-1528ed290384"};
                    var cdoShift = {"Id": "69f31af9-f77b-4744-b23d-297625f8fc0c"};
                    var superShift = {"Id": "1095a185-7cc4-4ae5-94f8-bb0503cde008"};

                    var shifts = [];

                    switch (dayOfWeek) {
                        case 0:
                            // DJO SJO MJO
                            shifts.push(makeShift(theDay, joodShift, 0, 8, "Day JOOD", 1));
                            shifts.push(makeShift(theDay, joodShift, 0, 16, "Swing JOOD", 1));
                            shifts.push(makeShift(theDay, joodShift, 0, 24, "Mid JOOD", 1));
                            shifts.push(makeShift(theDay, oodShift, 0, 8, "Day OOD", 3));
                            shifts.push(makeShift(theDay, oodShift, 0, 16, "Swing OOD", 3));
                            shifts.push(makeShift(theDay, oodShift, 0, 24, "Mid OOD", 3));
                            break;
                        case 6:
                            // DJO SJO MJO
                            shifts.push(makeShift(theDay, joodShift, 0, 8, "Day JOOD", 1));
                            shifts.push(makeShift(theDay, joodShift, 0, 16, "Swing JOOD", 2));
                            shifts.push(makeShift(theDay, joodShift, 0, 24, "Mid JOOD", 2));
                            shifts.push(makeShift(theDay, oodShift, 0, 8, "Day OOD", 3));
                            shifts.push(makeShift(theDay, oodShift, 0, 16, "Swing OOD", 6));
                            shifts.push(makeShift(theDay, oodShift, 0, 24, "Mid OOD", 6));
                            break;
                        case 1:
                        case 3:
                            // SJO MJO CDO2
                            shifts.push(makeShift(theDay, joodShift, 0, 16, "Swing JOOD", 1));
                            shifts.push(makeShift(theDay, joodShift, 0, 24, "Mid JOOD", 1));
                            shifts.push(makeShift(theDay, oodShift, 0, 16, "Swing OOD", 3));
                            shifts.push(makeShift(theDay, oodShift, 0, 24, "Mid OOD", 3));
                            shifts.push(makeShift(theDay, cdoShift, 2, 8, "CDO", 10));
                            break;
                        case 2:
                        case 4:
                            // SJO MJO
                            shifts.push(makeShift(theDay, joodShift, 0, 16, "Swing JOOD", 1));
                            shifts.push(makeShift(theDay, joodShift, 0, 24, "Mid JOOD", 1));
                            shifts.push(makeShift(theDay, oodShift, 0, 16, "Swing OOD", 3));
                            shifts.push(makeShift(theDay, oodShift, 0, 24, "Mid OOD", 3));
                            break;
                        case 5:
                            //SJO MJO CDO3
                            shifts.push(makeShift(theDay, joodShift, 0, 16, "Swing JOOD", 2));
                            shifts.push(makeShift(theDay, joodShift, 0, 24, "Mid JOOD", 2));
                            shifts.push(makeShift(theDay, oodShift, 0, 16, "Swing OOD", 6));
                            shifts.push(makeShift(theDay, oodShift, 0, 24, "Mid OOD", 6));
                            shifts.push(makeShift(theDay, cdoShift, 3, 8, "CDO", 20));
                            break;
                    }
                    return shifts;

                    /**
                     *
                     * @param {Object} day
                     * @param {Date} day.Date
                     * @param {Object} shift
                     * @param {number} days
                     * @param {number} hour
                     * @param {string} title
                     * @param {number} points
                     */
                    function makeShift(day, shift, days, hour, title, points) {
                        if (!points) {
                            points = 1;
                        }
                        var start = angular.copy(day.Date);
                        var end = angular.copy(day.Date);
                        start.setMinutes(45);
                        start.setSeconds(0);
                        start.setHours(hour-1);

                        if (days) {
                            end.setDate(end.getDate() + days)
                            end.setMinutes(45);
                            end.setSeconds(0);
                            end.setHours(hour - 1);
                        } else {
                            end.setMinutes(45);
                            end.setSeconds(0);
                            end.setHours(hour + 7);
                        }
                        return {
                            Range: {
                                Start: start,
                                End: end
                            },
                            ShiftType: shift,
                            Title: title,
                            Points: points
                        };

                    }
                };

                function fixWatchbill(watchbill) {

                    watchbill.Range.Start = new Date(watchbill.Range.Start);
                    watchbill.Range.End = new Date(watchbill.Range.End);

                    var millisecondsPerDays = 24 * 60 * 60 * 1000;
                    var numberOfDays = Math.abs(watchbill.Range.End - watchbill.Range.Start) / millisecondsPerDays + 1;
                    var days = [];
                    var shifts = watchbill.WatchShifts;
                    for (var i = 0; i < numberOfDays; i++) {
                        var fixedDate = new Date(watchbill.Range.Start);
                        fixedDate.setDate(fixedDate.getDate() + i);
                        days[i] = {
                            Date: fixedDate,
                            WatchShifts: []
                        }
                    }
                    for (var i = 0; i < shifts.length; i++) {
                        shifts[i].Range.Start = new Date(shifts[i].Range.Start);
                        shifts[i].Range.End = new Date(shifts[i].Range.End);
                        var j = Math.floor(Math.abs((watchbill.Range.Start - shifts[i].Range.Start) / millisecondsPerDays));
                        days[j].WatchShifts.push(shifts[i]);
                    }

                    // Sort our dates and shifts
                    days = $filter('orderBy')(days, 'Date');
                    watchbill.WatchShifts = $filter('orderBy')(watchbill.WatchShifts, 'Range.Start');

                    // This is how much we have to adjust the start of the week in the calendar
                    watchbill.pushAmount = (new Date(days[0].Date)).getDay();
                    watchbill.blankStartDays = new Array(watchbill.pushAmount);

                    // Create an array of the weeks populated with the days
                    watchbill.weeks = [];
                    angular.forEach(days, function (value, index) {
                        if (!watchbill.weeks[Math.floor((watchbill.pushAmount + index) / 7)]) {
                            watchbill.weeks[Math.floor((watchbill.pushAmount + index) / 7)] = [];
                        }
                        watchbill.weeks[Math.floor((watchbill.pushAmount + index) / 7)].push(days[index]);
                    });

                    watchbill.days = days;
                    return watchbill;
                }

                return service;
            }]);