'use strict';
 
angular.module('Profiles')
 
.factory('ProfileService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
		service.GetAllLists = function (success, error) {
			var reqData = {'apikey' : apikey};
			var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadLists";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});

        };
		service.GetPermissionGroups = function (success, error) {
			var reqData = {'apikey' : apikey};
			var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadPermissionGroups";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});

        };
		
		service.GetCommands = function (success, error) {
			var reqData = {'Name' : name, 'apikey' : apikey, 'acceptcachedresults' : true};
			var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadCommands";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});

        };

		service.UpdateMyProfile = function (person, success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'person': person };
		    var serviceurl = AuthenticationService.GetBackendURL() + "/UpdatePerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};

		service.CreatePerson = function (success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/CreatePerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};
		
		service.TakeLock = function(personid, success, error) {
			var reqData = {'authenticationtoken' : AuthenticationService.GetAuthToken(), 'apikey' : apikey, 'personid' : personid};
			var serviceurl =  AuthenticationService.GetBackendURL() + "/TakeProfileLock";
			$.ajax(
			{
				url: serviceurl,
				type: "POST",
				crossDomain: true,
				data: JSON.stringify(reqData),
				dataType: "json",
				success: function (response) {
					var returnContainer = JSON.parse(response);
					success(returnContainer);
				},
				error: function (response, status, errortext) {
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};

		service.LoadProfile = function (personid, success, error) {/*
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'personid': personid };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadPerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		*/
		    ConnectionService.RequestFromBackend('LoadPerson', {'personid' : personid}, success, error);
		};

		service.LoadAccountHistory = function (personid, success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'personid': personid };
		    var serviceurl =  AuthenticationService.GetBackendURL() + "/LoadAccountHistoryByPerson";
		    $.ajax(
			{
			    url: serviceurl,
			    type: "POST",
			    crossDomain: true,
			    data: JSON.stringify(reqData),
			    dataType: "json",
			    success: function (response) {
			        var returnContainer = JSON.parse(response);
			        success(returnContainer);
			    },
			    error: function (response, status, errortext) {
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};
		 
        return service;
    }]);