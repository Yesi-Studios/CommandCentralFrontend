'use strict';

angular.module('FAQ')

    .factory('FAQService',
        ['$http', '$localStorage', '$rootScope', 'config',
            function ($http, $localStorage, $rootScope, config) {
                var service = {};

                service.GetFAQs = function () {
                    var questions = [];

                    questions.push({
                        name: "muster-statuses",
                        question: "What muster status should a give a Sailor who is X?",
                        paragraphs: [
                            "This is a big one, so we're going to try to cover every non-intuitive case we can here.",

                            "If a Sailor is no longer in the name, rather than change the Sailor's muster status, please" +
                            " update the Sailor's Duty Status to the appropriate one, probably 'LOSS'. You may have to " +
                            "work with N1 on this.",

                            "If a Sailor is no longer in your division, please transfer the Sailor to their new division." +
                            " All division leadership and above should be able to do this. If not, contact N1.",

                            "If a Sailor is late to work, but has made contact with their chain of command, then either " +
                            "wait until they arrive and mark them as 'Present', if time allows, or mark them as 'AA'.",

                            "If a Sailor is in language class, they are considered 'TAD'.",

                            "For any other circumstances where the appropriate muster status isn't obvious, please reach" +
                            " out to N1 for clarification."
                        ]
                    });

                    question.push({
                        name: "more-information",
                        question: "Who do I contact if my question isn't covered here?",
                        paragraphs: [
                            "For questions regarding the functionality of this website, please contact the developers.",

                            "For questions about how to handle any given administrative situation, please contact N1."
                        ]
                    });
                };

                return service;
            }]);