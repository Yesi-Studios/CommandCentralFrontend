/**
 * Created by Angus on 3/20/2017.
 */
'use strict';

angular.module('Watchbill')

    .factory('WatchbillService',
        ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
            function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
                var service = {};

                service.LoadWatchbill = function (id, success, error) {
                    return ConnectionService.RequestFromBackend('LoadWatchbill', {'watchbillId': id, 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                return service;
            }]);