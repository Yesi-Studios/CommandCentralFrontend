'use strict';

angular.module('Administration')

.controller('ListEditorController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AdministrationService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AdministrationService, ConnectionService) {
        $rootScope.containsPII = false;
        $scope.dataLoading = true;
        $scope.errors = [];

        $scope.loadLists = function () {
            AdministrationService.LoadEditableLists(
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.lists = response.ReturnValue;
                    $scope.listNames = [];
                    for (var k in response.ReturnValue) $scope.listNames.push(k);
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }

        $scope.addListItem = function (listname, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddListItem(listname, value, description,
                function (response) {
                    $scope.messages.push("Item '" + value + "' successfully added to list '" + listname + "'.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }

        $scope.deleteListItem = function (list, listitem) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteListItem(listitem.Id,
                function (response) {
                    $scope.lists[list] = $.grep($scope.lists[list], function (e) {
                        return e.Id != listitem.Id;
                    });
                    $scope.messages.push("Item successfully deleted.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }

        $scope.updateListItem = function (list, listitem, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditListItem(listitem.Id, value, description,
                function (response) {
                    $scope.lists[list] = $.grep($scope.lists[list], function (e) {
                        return e.Id != listitem.Id;
                    });
                    $scope.lists.push({ "Id": listitem.Id, "Value": value, "Description": description });
                    $scope.messages.push("Item successfully updated.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }

        $scope.listItems = "o as o.Value for o in lists[selectedList]"

        $scope.loadLists();

    }
    ]
);