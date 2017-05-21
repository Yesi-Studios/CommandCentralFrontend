'use strict';

angular.module('Profiles')

    .directive('ngChangeEventsEditor', function () {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    canEdit: '@'
                },
                templateUrl: "modules/profile/directives/changeevents.html",
                controller: ['$scope', '$location', '$route', 'ProfileService', 'ConnectionService', function ($scope, $location, $route, ProfileService, ConnectionService) {
                    ProfileService.GetChangeEvents(
                        function (response) {
                            $scope.changeEvents = response.ReturnValue;
                        }, ConnectionService.HandleServiceError($scope, $location));
                }]
            }
        }
    );
