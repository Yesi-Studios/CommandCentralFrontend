'use strict';

angular.module('Search')

.controller('SearchController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService, config) {

        // This scope will just about always contain PII
        $rootScope.containsPII = true;

        $scope.itemsPerPage = 50;
        $scope.currentPage = 1;
        $scope.results = [];

        $scope.pageCount = function () {
            return Math.ceil($scope.friends.length / $scope.itemsPerPage);
        };

        $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

            $scope.filteredResults = $scope.results.slice(begin, end);
        });

        // This is the url for a profile
        $scope.goToProfile = function (id) {
            $location.path('/profile/' + id);
        };

        // This is the url we send them to so they can see their search results
        $scope.goToResults = function (terms) {
            $location.path('/search/' + terms);
        };

        // This enables the user to hit enter when they're done typing to initiate the search
        $scope.searchOnEnter = function ($event, terms) {
            if ($event.keyCode === 13) {
                $scope.goToResults(terms);
            }
        };

        // The default sorting key
        $scope.orderKey = "LastName";

        // Give our scope a way to sort
        $scope.setOrder = function (theKey) {
            if ($scope.orderKey == theKey) {
                $scope.orderKey = "-" + theKey;
            } else {
                $scope.orderKey = theKey;
            }
        };

        // Define how we do a simple search first, so we can do it whenever
        var simpleSearch = function (terms) {
            $scope.dataLoading = true;
            $scope.errors = null;
            SearchService.DoSimpleSearch(terms,
                function (response) {
                    $scope.dataLoading = false;
                    $scope.results = response.ReturnValue.Results;
                    $scope.fields = response.ReturnValue.Fields;
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;

                    $scope.filteredResults = $scope.results.slice(begin, end);
                },
			    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        // If we have search terms in our url, do the search and display the results
        if ($routeParams.searchTerms) {
            simpleSearch($routeParams.searchTerms);
            $scope.simpleSearchTerms = $routeParams.searchTerms;
        }

    }])

	.controller('SearchByFieldController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService, ConnectionService, config) {

        $rootScope.containsPII = true;
        $scope.searchLevels = ["Command", "Department", "Division"];
        $scope.selectedLevel = "Command";

        $scope.orderKey = "LastName";

        $scope.setOrder = function (theKey) {
            if ($scope.orderKey == theKey) {
                $scope.orderKey = "-" + theKey;
            } else {
                $scope.orderKey = theKey;
            }
        };

        $scope.itemsPerPage = 50;
        $scope.currentPage = 1;
        $scope.results = [];

        $scope.pageCount = function () {
            return Math.ceil($scope.friends.length / $scope.itemsPerPage);
        };

        $scope.$watch('currentPage + itemsPerPage + setOrder', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

            $scope.filteredResults = $scope.results.slice(begin, end);
        });

        $scope.getSearchableFields = function (level) {
            if(config.debugMode) console.log(AuthorizationService.GetReturnableFields(level));
            return AuthorizationService.GetReturnableFields(level);
        };

        $scope.getReturnableFields = function (level) {
            return AuthorizationService.GetReturnableFields(level);
        };

        $scope.advancedSearchFilters = {};

        $scope.goToProfile = function (id) {
            $location.path('/profile/' + id);
        };

        $scope.goToResults = function (filters, fields, level) {
            if (level == null) {
                level = $routeParams.searchLevel;
                if (level == null) {
                    level = "Command";
                }
            }
            level = level.replace(/['"]+/g, '');

            for (var i in filters) {
                if (filters[i] == "" || $scope.fieldsToSearch.indexOf(i) == -1) delete filters[i];
            }
            $location.path('/searchbyfield/' + JSON.stringify(filters) + '/' + JSON.stringify(fields) + '/' + JSON.stringify(level));
        };

        $scope.searchOnEnter = function ($event, filters, fields, level) {
            if ($event.keyCode === 13) {
                $scope.goToResults(filters, fields, level);
            }
        };
        var searchByField = function (filters, returnFields, searchLevel) {
            $scope.dataLoading = true;
            $scope.errors = null;
            if (searchLevel == null) {
                searchLevel = "Command";
            }
            SearchService.DoAdvancedSearch(filters, returnFields, searchLevel,
                // If we succeed, this is our callback
                function (response) {
                    // We're done loading, drop the results and a list of fields in them on the scope.
                    $scope.dataLoading = false;
                    $scope.results = response.ReturnValue.Results;
                    $scope.fields = response.ReturnValue.Fields;
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;

                    $scope.filteredResults = $scope.results.slice(begin, end);

                },
			    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
        if ($routeParams.searchTerms && $routeParams.returnFields && $routeParams.searchLevel) {
            searchByField(JSON.parse($routeParams.searchTerms), JSON.parse($routeParams.returnFields), JSON.parse($routeParams.searchLevel));
            $scope.searchByFieldTerms = JSON.parse($routeParams.searchTerms);
            $scope.searchByFieldReturns = JSON.parse($routeParams.returnFields);
            $scope.fieldsToReturn = JSON.parse($routeParams.returnFields);
            $scope.fieldsToSearch = Object.keys(JSON.parse($routeParams.searchTerms));
            $scope.advancedSearchFilters = $scope.searchByFieldTerms;
            $scope.selectedLevel = JSON.parse($routeParams.searchLevel);

            if(config.debugMode) console.log(JSON.parse($routeParams.searchTerms));
            if(config.debugMode) console.log(JSON.parse($routeParams.returnFields));


        }

    }]);