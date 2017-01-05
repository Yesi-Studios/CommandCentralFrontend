'use strict';

angular.module('FAQ')

    .factory('FAQService',
        ['$http', '$localStorage', '$rootScope', 'config', 'ConnectionService', 'AuthenticationService',
            function ($http, $localStorage, $rootScope, config, ConnectionService, AuthenticationService) {
                var service = {};

                service.thinger = function () { return "asdfasdfasdfasdf"};

                // service.GetFAQs = function () {
                //     var questions = [];
                //
                //     questions.push({
                //         name: "excel-export",
                //         question: "How do I export to Excel?",
                //         paragraphs: [
                //             "We don't support exporting to Excel, for several reasons.",
                //
                //             "Excel is not designed to manage an entire command, especially not one as large as NIOC GA. " +
                //             "We designed Command Central to enable the entire command to work on the same database," +
                //             " instead of everyone having their own trackers, with different data, and then spending " +
                //             "countless hours getting that data to match up. If we enable users to export to Excel, that" +
                //             " could lead us down the same path.",
                //
                //             "If you find there is something that you need done that Command Central doesn't support," +
                //             " please let us know, and we'll do our best to get that implemented for you quickly!",
                //
                //             "We do understand, however, that there are special circumstances where exporting to Excel" +
                //             " will be both necessary and appropriate. Please contact the development team for those " +
                //             "circumstances, and we'll be happy to assist you."
                //         ]
                //     });
                //
                //     questions.push({
                //         name: "muster-statuses",
                //         question: "What muster status should a give I Sailor who is X?",
                //         paragraphs: [
                //             "This is a big one, so we're going to try to cover every non-intuitive case we can here.",
                //
                //             "If a Sailor is no longer in the name, rather than change the Sailor's muster status, please" +
                //             " update the Sailor's Duty Status to the appropriate one, probably 'LOSS'. You may have to " +
                //             "work with N1 on this.",
                //
                //             "If a Sailor is no longer in your division, please transfer the Sailor to their new division." +
                //             " All division leadership and above should be able to do this. If not, contact N1.",
                //
                //             "If a Sailor is late to work, but has made contact with their chain of command, then either " +
                //             "wait until they arrive and mark them as 'Present', if time allows, or mark them as 'AA'.",
                //
                //             "If a Sailor is in language class, they are considered 'TAD'.",
                //
                //             "For any other circumstances where the appropriate muster status isn't obvious, please reach" +
                //             " out to N1 for clarification."
                //         ]
                //     });
                //
                //     questions.push({
                //         name: "more-information",
                //         question: "Who do I contact if my question isn't covered here?",
                //         paragraphs: [
                //             "For questions regarding the functionality of this website, please contact the developers.",
                //
                //             "For questions about how to handle any given administrative situation, please contact N1."
                //         ]
                //     });
                //
                //     return questions;
                // };

                service.LoadFAQs = function (success, error) {
                    return ConnectionService.RequestFromBackend('LoadFAQs', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
                };

                service.LoadFAQ = function (itemID, success, error) {
                    return ConnectionService.RequestFromBackend('LoadFAQ', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': itemID}, success, error);
                };

                service.CreateOrUpdateFAQ = function (faq, success, error) {
                    return ConnectionService.RequestFromBackend('CreateOrUpdateFAQ', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'faq': faq }, success, error);
                };

                service.DeleteFAQ = function (faq, success, error) {
                    return ConnectionService.RequestFromBackend('DeleteNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'faq': faq }, success, error);
                };

                return service;
            }]);