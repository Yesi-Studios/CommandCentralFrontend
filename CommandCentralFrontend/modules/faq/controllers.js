'use strict';

angular.module('FAQ')

.controller('FAQController',
    ['$scope', '$rootScope', 'config', 'FAQService',
        function ($scope, $rootScope, config, FAQService) {
            $scope.question = FAQService.GetFAQs();
        }]);