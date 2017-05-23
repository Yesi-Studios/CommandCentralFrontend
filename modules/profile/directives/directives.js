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
                            fixEvents();
                        }, ConnectionService.HandleServiceError($scope, $location));


                    $scope.$watch('ngModel', function() {
                        if ($scope.changeEvents) {
                            fixEvents();
                        }
                    });

                    function fixEvents() {
                        if(!$scope.ngModel) {$scope.ngModel = {};}
                        for (var i = 0; i < $scope.changeEvents.length; i++) {
                            var ev = $scope.changeEvents[i];
                            $scope.ngModel[ev.Id] = $scope.ngModel[ev.Id] || 'None';
                        }
                    }
                }]
            }
        }
    );
