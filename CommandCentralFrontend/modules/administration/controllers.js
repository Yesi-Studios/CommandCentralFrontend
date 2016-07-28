'use strict';

angular.module('Administration')

.controller('ListEditorController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AdministrationService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AdministrationService, ConnectionService) {
        $rootScope.containsPII = false;
        $scope.dataLoading = true;
        $scope.errors = [];

        $scope.blah = function (athing) { console.log(athing); };

        $scope.loadLists = function () {
            AdministrationService.LoadEditableLists(
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.lists = response.ReturnValue;
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
                    $scope.loadLists();
                    $scope.messages.push("Item '" + value + "' successfully added to list '" + listname + "'.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }

        $scope.deleteListItem = function (listItem, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteListItem(listItem.Id, forceDelete,
                function (response) {
                    $scope.loadLists();
                    $scope.messages.push("Item successfully deleted.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }

        $scope.updateListItem = function (list, listItem) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditListItem(listItem.Id, listItem.Value, listItem.Description, list,
                function (response) {
                    $scope.loadLists();
                    $scope.messages.push("Item successfully updated.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        }


        $scope.loadLists();

    }
    ]
);