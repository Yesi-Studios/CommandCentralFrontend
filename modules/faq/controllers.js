'use strict';

angular.module('FAQ')

    .controller('FAQController',
        ['$scope', '$rootScope', '$location', 'config', 'FAQService', 'AuthorizationService', 'ConnectionService',
            function ($scope, $rootScope, $location, config, FAQService, AuthorizationService, ConnectionService) {
                var errorHandler = function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                };

                $scope.userCanEditFAQs = function () {
                    return AuthorizationService.CanEditFAQs();
                };

                $scope.deleteFAQ = function (faq) {
                    FAQService.DeleteFAQ({Id: "e614698a-93dd-4047-a3bc-d09043f705ce"}, function (response) {
                            loadFAQs();
                        }, errorHandler);
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

            var errorHandler = function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            };

            $scope.userCanEditFAQs = function () {
                return AuthorizationService.CanEditFAQs();
            };

            if ($routeParams.id) {
                $scope.dataLoading = true;
                FAQService.LoadFAQ($routeParams.id,
                    function (response) {
                        $scope.dataLoading = false;
                        $scope.faqName = response.ReturnValue.Name;
                        $scope.faqQuestion = response.ReturnValue.Question;
                        $scope.faqBody = response.ReturnValue.Paragraphs.join('\n');
                    }, errorHandler);

            }

            $scope.saveFAQ = function (name, question, body) {
                $scope.dataLoading = true;

                // Create a new FAQ with what we got
                var newFAQ = {
                    'Id': $routeParams.id,
                    'Name': name,
                    'Question': question,
                    'Paragraphs': body.match(/[^\r\n]+/g)
                };

                // If we aren't editing an existing FAQ, remove the Id keyword for safety
                if (!$routeParams.id) { delete newFAQ['Id']; }

                // Do the Update
                FAQService.CreateOrUpdateFAQ(newFAQ,
                    function (response) {
                        $scope.dataLoading = false;
                        $location.path('/faq');

                    }, errorHandler);
            };

        }]);
