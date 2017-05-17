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
                    }, ConnectionService.HandleServiceError($scope, $location))
            }

        }]);