'use strict';

angular.module('Search')

.controller('SearchController',
    ['$scope', '$filter', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 'config',
    function ($scope, $filter, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService, config) {

        // This scope will just about always contain PII
        $rootScope.containsPII = true;

        $scope.Math = window.Math;
        $scope.itemsPerPage = 50;
        $scope.currentPage = 1;
        $scope.results = [];

        if($routeParams.showHidden){
            $scope.showHidden = JSON.parse($routeParams.showHidden);
        } else {
            $scope.showHidden = false;
        }

        $scope.pageCount = function () {
            return Math.ceil($scope.friends.length / $scope.itemsPerPage);
        };

        $scope.$watch('currentPage + itemsPerPage + setOrder + orderKey', function() {
            var begin = (parseInt($scope.currentPage, 10) - 1) * parseInt($scope.itemsPerPage, 10);
            var end = parseInt(begin, 10) + parseInt($scope.itemsPerPage, 10);

            $scope.results = $filter('orderBy')($scope.results, $scope.orderKey);
            $scope.filteredResults = $scope.results.slice(begin, end);
        });


        // This is the url for a profile
        $scope.goToProfile = function (id) {
            $location.path('/profile/' + id);
        };

        // This is the url we send them to so they can see their search results
        $scope.goToResults = function (terms) {
            $location.path('/search/' + terms + "/" + JSON.stringify($scope.showHidden));
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
        var simpleSearch = function (terms, showHidden) {
            $scope.dataLoading = true;
            $scope.errors = [];
            SearchService.DoSimpleSearch(terms, $scope.showHidden,
                function (response) {
                    $scope.dataLoading = false;
                    $scope.results = response.ReturnValue.Results;
                    $scope.fields = response.ReturnValue.Fields;
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;

                    $scope.results = $filter('orderBy')($scope.results, $scope.orderKey);
                    $scope.filteredResults = $scope.results.slice(begin, end);
                    if($scope.results.length == 0) {
                        $scope.errors.push("No results for that query.");
                    }
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
    ['$scope', '$filter', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 'ConnectionService', 'config',
    function ($scope, $filter, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService, ConnectionService, config) {

        $rootScope.containsPII = true;
        $scope.searchLevels = ["Command", "Department", "Division"];
        $scope.selectedLevel = "Command";

        $scope.orderKey = "LastName";

        if($routeParams.showHidden){
            $scope.showHidden = JSON.parse($routeParams.showHidden);
        } else {
            $scope.showHidden = false;
        }

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

        SearchService.GetFieldTypes(
            function(response){
                $scope.fieldTypes = response.ReturnValue;
                console.log($scope.fieldTypes);
            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );
        $scope.pageCount = function () {
            return Math.ceil($scope.friends.length / $scope.itemsPerPage);
        };

        $scope.$watch('currentPage + itemsPerPage + setOrder + orderKey', function() {
            var begin = (parseInt($scope.currentPage, 10) - 1) * parseInt($scope.itemsPerPage, 10);
            var end = parseInt(begin, 10) + parseInt($scope.itemsPerPage, 10);

            $scope.results = $filter('orderBy')($scope.results, $scope.orderKey);
            $scope.filteredResults = $scope.results.slice(begin, end);
        });

        $scope.getSearchableFields = function (level) {
            //if(config.debugMode) console.log(AuthorizationService.GetReturnableFields(level));
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
            console.log($scope.advancedSearchFilters);
            if (level == null) {
                level = $routeParams.searchLevel;
                if (level == null) {
                    level = "Command";
                }
            }
            level = level.replace(/['"]+/g, '');

            for (var i in filters) {
                if (filters[i] == "" || $scope.fieldsToSearch.indexOf(i) == -1){
                    delete filters[i];
                } else {
                    console.log(i);
                    console.log($scope.fieldTypes[i]);
                    console.log(filters[i]);
                    if ($scope.fieldTypes[i].SearchDataType == "DateTime") {
                        var newFilter = [];
                        for ( var j in filters[i])  {
                            newFilter.push({});
                            if (filters[i][j].To != null) newFilter[j].To = filters[i][j].To;
                            if (filters[i][j].From != null) newFilter[j].From = filters[i][j].From;

                        }
                        filters[i] = newFilter;
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
                        console.log(filters[i]);
                    }
                }
            }
            console.log(filters);
            console.log("***********************");
            $location.path('/searchbyfield/' + JSON.stringify(filters) + '/' + JSON.stringify(fields) + '/' + JSON.stringify(level) + '/' + JSON.stringify($scope.showHidden));
        };

        $scope.searchOnEnter = function ($event, filters, fields, level) {
            if ($event.keyCode === 13) {
                $scope.goToResults(filters, fields, level);
            }
        };
        var searchByField = function (filters, returnFields, searchLevel) {
            $scope.dataLoading = true;
            $scope.errors = [];
            if (searchLevel == null) {
                searchLevel = "Command";
            }
            SearchService.DoAdvancedSearch(filters, returnFields, searchLevel, $scope.showHidden,
                // If we succeed, this is our callback
                function (response) {
                    // We're done loading, drop the results and a list of fields in them on the scope.
                    $scope.dataLoading = false;
                    $scope.results = response.ReturnValue.Results;
                    $scope.fields = response.ReturnValue.Fields;
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;

                    $scope.results = $filter('orderBy')($scope.results, $scope.orderKey);
                    $scope.filteredResults = $scope.results.slice(begin, end);

                    if($scope.results.length == 0) {
                        $scope.errors.push("No results for that query.");
                    }
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
            console.log("HERE");
            console.log($scope.advancedSearchFilters);
            $scope.selectedLevel = JSON.parse($routeParams.searchLevel);

            if(config.debugMode) console.log(JSON.parse($routeParams.searchTerms));
            if(config.debugMode) console.log(JSON.parse($routeParams.returnFields));


        }

    }]);