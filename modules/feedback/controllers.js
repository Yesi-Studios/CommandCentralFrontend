'use strict';

angular.module('Feedback')

.controller('FeedbackController',
    ['$scope', '$rootScope', 'config', 'FeedbackService',
        function ($scope, $rootScope, config, FeedbackService) {

            $scope.sendFeedback = function(title, body) {
                $scope.dataLoading = true;
                FeedbackService.SendFeedback(title, body,
                    function(response) {
                        $scope.dataLoading = false;
                        $scope.showSuccess = true;
                        $scope.title = "";
                        $scope.body = "";
                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                )
            }

        }]);