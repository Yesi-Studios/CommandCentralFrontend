'use strict';
 
angular.module('Search')
 
.controller('SearchController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService) {
		
		$scope.goToProfile= function(id) {
			$location.path('/profile/'+id);
		};
		
		$scope.goToResults = function(terms) {
			$location.path('/search/'+ terms);
		};
		
		$scope.searchOnEnter = function($event, terms) {
			if($event.keyCode === 13) {
				$scope.goToResults(terms);
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
		
		//$scope.searchableFields = AuthorizationService.GetSearchableFields();
		//$scope.returnableFields = AuthorizationService.GetReturnableFields();
		
		var simpleSearch = function(terms){
			$scope.dataLoading = true;
			$scope.error = "";
			SearchService.DoSimpleSearch(terms, function(response) {
				if(!response.HasError) {
                    $scope.$apply(function() {
						$scope.dataLoading = false;
						console.log(response.ReturnValue);
						$scope.results = response.ReturnValue.Results;
						$scope.fields = response.ReturnValue.Fields;
					});
                } else {
					$scope.$apply(function() {
						$scope.error = "Search failed: " + response.ErrorMessage;
						$scope.dataLoading = false;
						AuthenticationService.AddLoginError("Search returned an error:" + response.ErrorMessage);
						$location.path('/login');
					});
				}
			});
		};
		
		if($routeParams.searchTerms) {
			simpleSearch($routeParams.searchTerms);
			$scope.simpleSearchTerms = $routeParams.searchTerms;
		}
		
    }])

	.controller('SearchByFieldController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'SearchService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, SearchService) {
	
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
			$scope.error = "";
			SearchService.DoAdvancedSearch(filters, returnFields, function(response) {
				if(!response.HasError) {
                    $scope.$apply(function() {
						$scope.dataLoading = false;
						console.log(response.ReturnValue);
						$scope.results = response.ReturnValue.Results;
						$scope.fields = response.ReturnValue.Fields;
					});
                } else {
					$scope.$apply(function() {
						$scope.error = "Search failed: " + response.ErrorMessage;
						$scope.dataLoading = false;
						AuthenticationService.AddLoginError("Search returned an error:" + response.ErrorMessage);
						$location.path('/login');
					});
				}
			});
		}
		if($routeParams.searchTerms && $routeParams.returnFields) {
			searchByField(JSON.parse($routeParams.searchTerms), JSON.parse($routeParams.returnFields));
			$scope.searchByFieldTerms = JSON.parse($routeParams.searchTerms);
			$scope.searchByFieldReturns = JSON.parse($routeParams.returnFields);
		}
		
	}]);