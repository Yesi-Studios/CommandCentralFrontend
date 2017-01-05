'use strict';

angular.module('FAQ')

.controller('FAQController',
    ['$scope', '$rootScope', 'config', 'FAQService',
        function ($scope, $rootScope, config, FAQService) {

            $scope.dataLoading = true;
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
        }])
.controller('CreateFAQController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'FAQService', 'ConnectionService',
    function ($scope, $rootScope, $location, AuthenticationService, FAQService, ConnectionService) {
        $scope.saveFAQ = function (name, question, body) {
            FAQService.CreateOrUpdateFAQ({'Name':name, 'Question': question, 'Paragraphs': body.match(/[^\r\n]+/g)},
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