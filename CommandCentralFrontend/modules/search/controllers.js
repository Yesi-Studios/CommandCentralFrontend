'use strict';
 
angular.module('Search')
 
.controller('SearchController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService) {
		
        // This scope will just about always contain PII
        $rootScope.containsPII = true;

        // This is the url for a profile
		$scope.goToProfile= function(id) {
			$location.path('/profile/'+id);
		};
		
        // This is the url we send them to so they can see their search results
		$scope.goToResults = function(terms) {
			$location.path('/search/'+ terms);
		};
		
        // This enables the user to hit enter when they're done typing to initiate the search
		$scope.searchOnEnter = function($event, terms) {
			if($event.keyCode === 13) {
				$scope.goToResults(terms);
			}
		};
		
        // The default sorting key
		$scope.orderKey = "LastName";
		
        // Give our scope a way to sort
		$scope.setOrder = function(theKey) {
			if($scope.orderKey == theKey){
				$scope.orderKey = "-" + theKey;
			} else {
				$scope.orderKey = theKey;
			}
		}
		
        // Define how we do a simple search first, so we can do it whenever
		var simpleSearch = function(terms){
			$scope.dataLoading = true;
			$scope.errors = null;
			SearchService.DoSimpleSearch(terms,
                function (response) {
                    $scope.$apply(function() {
						$scope.dataLoading = false;
						console.log(response.ReturnValue);
						$scope.results = response.ReturnValue.Results;
						$scope.fields = response.ReturnValue.Fields;
					});
				},
			    // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
		};
		
        // If we have search terms in our url, do the search and display the results
		if($routeParams.searchTerms) {
			simpleSearch($routeParams.searchTerms);
			$scope.simpleSearchTerms = $routeParams.searchTerms;
		}
		
    }])

	.controller('SearchByFieldController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService) {
	
        $rootScope.containsPII = true;

		$scope.searchableFields = AuthorizationService.GetSearchableFields();
		$scope.returnableFields = AuthorizationService.GetReturnableFields();
		$scope.advancedSearchFilters = {};		 
		
		$scope.goToProfile= function(id) {
			$location.path('/profile/'+id);
		};
		
		$scope.goToResults = function(filters, fields) {
			$location.path('/searchbyfield/'+ JSON.stringify(filters) + '/' + JSON.stringify(fields));
		};
		
		$scope.searchOnEnter = function($event, filters, fields) {
			if($event.keyCode === 13) {
				$scope.goToResults(filters, fields);
			}
		};
		
		$scope.orderKey = "LastName";
		
		$scope.setOrder = function(theKey) {
			if($scope.orderKey == theKey){
				$scope.orderKey = "-" + theKey;
			} else {
				$scope.orderKey = theKey;
			}
		}
		
		var searchByField = function(filters, returnFields) {
			$scope.dataLoading = true;
			$scope.errors = null;
			SearchService.DoAdvancedSearch(filters, returnFields,
                // If we succeed, this is our callback
                function(response) {
                    $scope.$apply(function () {
                        // We're done loading, drop the results and a list of fields in them on the scope.
						$scope.dataLoading = false;
						$scope.results = response.ReturnValue.Results;
						$scope.fields = response.ReturnValue.Fields;
					});
				},
			    // If we fail, this is our call back (nearly the same for all backend calls)
                function (response) {
                    $scope.$apply(function () {
                        // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                        // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                        if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                            for (var i = 0; i < response.ErrorMessages.length; i++) {
                                AuthenticationService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                            }
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            // If it's any other type of error, we can just show it to them on this page.
                            $scope.errors = response.ErrorMessages;
                        }
                        $scope.dataLoading = false;
                    });
                }
            );
		}
		if($routeParams.searchTerms && $routeParams.returnFields) {
			searchByField(JSON.parse($routeParams.searchTerms), JSON.parse($routeParams.returnFields));
			$scope.searchByFieldTerms = JSON.parse($routeParams.searchTerms);
			$scope.searchByFieldReturns = JSON.parse($routeParams.returnFields);
			$scope.fieldsToReturn = JSON.parse($routeParams.returnFields);
			$scope.fieldsToSearch = Object.keys(JSON.parse($routeParams.searchTerms));
		    $scope.advancedSearchFilters = $scope.searchByFieldTerms


		}
		
	}]);