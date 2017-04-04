'use strict';

angular.module('Feedback')

    .factory('FeedbackService',
        ['$http', '$localStorage', '$rootScope', 'config', 'ConnectionService', 'AuthenticationService',
            function ($http, $localStorage, $rootScope, config, ConnectionService, AuthenticationService) {
                var service = {};

                service.SendFeedback = function (title, body, success, error) {
                    return ConnectionService.RequestFromBackend('SubmitFeedback', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'title' : title, 'body' : body}, success, error);
                };
                return service;
            }]);