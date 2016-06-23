'use strict';
 
angular.module('Profiles')
 
.factory('ProfileService',
    ['Base64', '$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService',
    function (Base64, $http, $localStorage, $rootScope, $timeout, AuthenticationService) {
        var service = {};
        var apikey = AuthenticationService.GetAPIKey();
        var baseurl = AuthenticationService.GetBackendURL();
		
		service.GetAllLists = function (success, error) {
			var reqData = {'apikey' : apikey};
			var serviceurl = baseurl + "/LoadLists";
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
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});

        };
		service.GetPermissionGroups = function (success, error) {
			var reqData = {'apikey' : apikey};
			var serviceurl = baseurl + "/LoadPermissionGroups";
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
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});

        };
		
		service.GetCommands = function (success, error) {
			var reqData = {'Name' : name, 'apikey' : apikey, 'acceptcachedresults' : true};
			var serviceurl = baseurl + "/LoadCommands";
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
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});

        };

		service.UpdateMyProfile = function (person, success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'person': person };
		    var serviceurl = baseurl + "/UpdatePerson";
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
                    console.log(response)
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};

		service.CreatePerson = function (success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey };
		    var serviceurl = baseurl + "/CreatePerson";
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
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};
		
		service.TakeLock = function(personid, success, error) {
			var reqData = {'authenticationtoken' : AuthenticationService.GetAuthToken(), 'apikey' : apikey, 'personid' : personid};
			var serviceurl = baseurl + "/TakeProfileLock";
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
				    console.log(response);
				    var returnContainer = JSON.parse(response.responseJSON);
				    error(returnContainer);
				}
			});
		};

		service.LoadProfile = function (personid, success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'personid': personid };
		    var serviceurl = baseurl + "/LoadPerson";
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
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};

		service.LoadAccountHistory = function (personid, success, error) {
		    var reqData = { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'apikey': apikey, 'personid': personid };
		    var serviceurl = baseurl + "/LoadAccountHistoryByPerson";
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
			        console.log(response);
			        var returnContainer = JSON.parse(response.responseJSON);
			        error(returnContainer);
			    }
			});
		};
		 
        return service;
    }]);