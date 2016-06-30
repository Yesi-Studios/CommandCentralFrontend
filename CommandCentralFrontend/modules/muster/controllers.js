'use strict';
 
angular.module('Muster')
 
.controller('MusterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService) {
		
        // This scope will just about always contain PII
        $rootScope.containsPII = true;
		}
		
    ]);