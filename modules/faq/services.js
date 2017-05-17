'use strict';

angular.module('FAQ')

    .factory('FAQService',
        ['$http', '$localStorage', '$rootScope', 'config', 'ConnectionService', 'AuthenticationService',
            function ($http, $localStorage, $rootScope, config, ConnectionService, AuthenticationService) {
                var service = {};

                service.LoadFAQs = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadFAQs', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadFAQ = function (faqid, success, error) {
                    return ConnectionService.RequestFromBackend('LoadFAQ', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'faqid': faqid}, success, error);
                };

                service.CreateOrUpdateFAQ = function (faq, success, error) {
                    return ConnectionService.RequestFromBackend('CreateOrUpdateFAQ', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'faq': faq }, success, error);
                };

                service.DeleteFAQ = function (faq, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteFAQ', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'faq': faq }, success, error);
                };

                return service;
            }]);