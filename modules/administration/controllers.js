'use strict';

angular.module('Administration')

.controller('ListEditorController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AdministrationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AdministrationService, ConnectionService, config) {
        $rootScope.containsPII = false;
        $scope.dataLoading = true;
        $scope.errors = [];

        $scope.blah = function (athing) { if(config.debugMode) console.log(athing); };

        $scope.loadLists = function () {
            AdministrationService.LoadEditableLists(
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.lists = response.ReturnValue;
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.addListItem = function (listname, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddListItem(listname, value, description,
                function (response) {
                    $scope.loadLists();
                    $scope.messages.push("Item '" + value + "' successfully added to list '" + listname + "'.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.deleteListItem = function (listItem, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteListItem(listItem.Id, $scope.selectedList, forceDelete,
                function (response) {
                    $scope.loadLists();
                    $scope.messages.push("Item successfully deleted.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.updateListItem = function (list, listItem) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditListItem(listItem.Id, listItem.Value, listItem.Description, list,
                function (response) {
                    $scope.loadLists();
                    $scope.messages.push("Item successfully updated.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };


        $scope.loadLists();

    }
    ]
)
.controller('CommandEditorController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AdministrationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AdministrationService, ConnectionService, config) {
        $rootScope.containsPII = false;
        $scope.dataLoading = true;
        $scope.errors = [];

        $scope.blah = function (athing) { if(config.debugMode) console.log(athing); };

        $scope.loadCommands = function () {
            AdministrationService.LoadCommands(
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.commands = response.ReturnValue.Command;
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.addCommand = function (value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddCommand(value, description,
                function (response) {
                    $scope.loadCommands();
                    $scope.messages.push("Command '" + value + "' successfully added.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.deleteCommand = function (commandid, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteCommand(commandid, forceDelete,
                function (response) {
                    $scope.loadCommands();
                    $scope.messages.push("Command successfully deleted.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.updateCommand = function (id, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditCommand(id, value, description,
                function (response) {
                    $scope.loadCommands();
                    $scope.messages.push("Command successfully updated.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };


        $scope.loadCommands();

    }
    ]
)
.controller('DepartmentEditorController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AdministrationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AdministrationService, ConnectionService, config) {
        $rootScope.containsPII = false;
        $scope.dataLoading = true;
        $scope.errors = [];

        $scope.blah = function (athing) { if(config.debugMode) console.log(athing); };

        $scope.commandId = $routeParams.id;

        AdministrationService.LoadCommand($routeParams.id,
            function (response) {
                $scope.command = response.ReturnValue.Command;
            }, ConnectionService.HandleServiceError($scope, $location));

        $scope.loadDepartments = function () {
            AdministrationService.LoadDepartments($routeParams.id,
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.departments = response.ReturnValue.Department;
                    if(config.debugMode) console.log(response.ReturnValue.Department);
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.addDepartment = function (value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddDepartment($routeParams.id, value, description,
                function (response) {
                    $scope.loadDepartments();
                    $scope.messages.push("Department '" + value + "' successfully added.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.deleteDepartment = function (departmentid, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteDepartment(departmentid, forceDelete,
                function (response) {
                    $scope.loadDepartments();
                    $scope.messages.push("Department successfully deleted.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.updateDepartment = function (id, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditDepartment($routeParams.id, id, value, description,
                function (response) {
                    $scope.loadDepartments();
                    $scope.messages.push("Department successfully updated.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };


        $scope.loadDepartments();

    }
    ]
)
.controller('DivisionEditorController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AdministrationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AdministrationService, ConnectionService, config) {
        $rootScope.containsPII = false;
        $scope.dataLoading = true;
        $scope.errors = [];

        $scope.blah = function (athing) { if(config.debugMode) console.log(athing); };

        $scope.departmentId = $routeParams.depId;
        $scope.commandId = $routeParams.id;

        AdministrationService.LoadDepartment($routeParams.depId,
            function (response) {
                $scope.department = response.ReturnValue.Department[0];
            }, ConnectionService.HandleServiceError($scope, $location));

        AdministrationService.LoadCommand($routeParams.id,
            function (response) {
                $scope.command = response.ReturnValue;
            }, ConnectionService.HandleServiceError($scope, $location));

        $scope.loadDivisions = function () {
            AdministrationService.LoadDivisions($routeParams.depId,
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.divisions = response.ReturnValue.Division;
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.addDivision = function (value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddDivision($routeParams.depId, value, description,
                function (response) {
                    $scope.loadDivisions();
                    $scope.messages.push("Division '" + value + "' successfully added.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.deleteDivision = function (divisionid, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteDivision(divisionid, forceDelete,
                function (response) {
                    $scope.loadDivisions();
                    $scope.messages.push("Division successfully deleted.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };

        $scope.updateDivision = function (id, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditDivision($routeParams.depId, id, value, description,
                function (response) {
                    $scope.loadDivisions();
                    $scope.messages.push("Division successfully updated.");
                }, ConnectionService.HandleServiceError($scope, $location));
        };


        $scope.loadDivisions();

    }
    ]
);