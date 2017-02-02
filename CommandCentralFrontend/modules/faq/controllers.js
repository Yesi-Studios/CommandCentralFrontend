'use strict';

angular.module('FAQ')

.controller('FAQController',
    ['$scope', '$rootScope', 'config', 'FAQService', 'AuthorizationService',
        function ($scope, $rootScope, config, FAQService, AuthorizationService) {

            $scope.userCanEditFAQs = function () { return AuthorizationService.CanEditFAQs(); };

            $scope.deleteFAQ = function (faq) {
                FAQService.DeleteFAQ(faq, function(response) {
                        loadFAQs();
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    });
            };

            $scope.dataLoading = true;
            var loadFAQs = function () {
                FAQService.LoadFAQs(
                    function (response) {
                        $scope.dataLoading = false;
                        $scope.questions = response.ReturnValue;
                        $scope.loadedTime = new Date;
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );
            };

            loadFAQs();

        }])
.controller('CreateFAQController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'FAQService', 'ConnectionService', 'AuthorizationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, FAQService, ConnectionService, AuthorizationService) {

        $scope.userCanEditFAQs = function () { return AuthorizationService.CanEditFAQs(); };

       if($routeParams.id) {
           $scope.dataLoading = true;
           FAQService.LoadFAQ($routeParams.id,
               function(response){
                    $scope.dataLoading = false;
                   $scope.faqName= response.ReturnValue.Name;
                   $scope.faqQuestion = response.ReturnValue.Question;
                   $scope.faqBody = response.ReturnValue.Paragraphs.join('\n');
               },
               // If we fail, this is our call back. We use a convenience function in the ConnectionService.
               function (response) {
                   ConnectionService.HandleServiceError(response, $scope, $location);
               }
           );

        }

        $scope.saveFAQ = function (name, question, body) {
            $scope.dataLoading = true;
            var newFAQ;
            if($routeParams.id) {
                newFAQ = {'Id': $routeParams.id, 'Name':name, 'Question': question, 'Paragraphs': body.match(/[^\r\n]+/g)};
            } else {
                newFAQ = {'Name':name, 'Question': question, 'Paragraphs': body.match(/[^\r\n]+/g)};
            }
            FAQService.CreateOrUpdateFAQ(newFAQ,
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/faq');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

    }]);