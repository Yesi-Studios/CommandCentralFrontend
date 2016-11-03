'use strict';

// declare modules
angular.module('Connection', []);
angular.module('Authentication', ['Authorization', 'angularModalService', 'Modals', 'Profiles', 'Connection']);
angular.module('Authorization', ['Authentication', 'Connection']);
angular.module('Navigation', ['Authentication', 'Profiles', 'Authorization']);
angular.module('Profiles', ['Authentication', 'ui.bootstrap', 'ui.mask', 'Connection']);
angular.module('Home', ['Authentication', 'Authorization', 'pdf', 'Connection']);
angular.module('Administration', ['Authentication', 'Connection']);
angular.module('Search', ['Authentication', 'Authorization', 'Connection', 'ui.bootstrap']);
angular.module('Muster', ['Authentication', 'Authorization', 'Profiles', 'Connection']);

angular.module('Modals', ['angularModalService']);

angular.module('CommandCentral', [
    'Administration',
    'Authentication',
	'Authorization',
    'Connection',
    'Home',
	'Navigation',
	'Profiles',
	'Search',
    'Modals',
    'Muster',
    'angularModalService',
    'ngRoute',
    'ngStorage',
	'ui.bootstrap',
    'ui.mask',
	'pdf'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider

        .when('/login/:redirectURL', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })

        .when('/createnews', {
            controller: 'CreateNewsController',
            templateUrl: 'modules/home/views/createnews.html'
        })

        .when('/muster', {
            controller: 'MusterController',
            templateUrl: 'modules/muster/views/muster.html'
        })

        .when('/muster/finalize', {
            controller: 'FinalizeMusterController',
            templateUrl: 'modules/muster/views/finalizemuster.html'
        })

        .when('/muster/archive/:musterDate', {
            controller: 'MusterArchiveController',
            templateUrl: 'modules/muster/views/archive.html'
        })

        .when('/muster/archive', {
            controller: 'MusterArchiveController',
            templateUrl: 'modules/muster/views/archive.html'
        })

        .when('/updatenews/:id', {
            controller: 'UpdateNewsController',
            templateUrl: 'modules/home/views/updatenews.html'
        })
		
		.when('/profile/:id', {
            controller: 'ProfileController',
            templateUrl: 'modules/profile/views/profile.html'
        })
		
		.when('/search', {
            controller: 'SearchController',
            templateUrl: 'modules/search/views/search.html'
        })
		
		.when('/search/:searchTerms/:showHidden', {
            controller: 'SearchController',
            templateUrl: 'modules/search/views/search.html'
        })
		
		.when('/searchbyfield', {
            controller: 'SearchByFieldController',
            templateUrl: 'modules/search/views/searchbyfield.html'
        })
		
		.when('/searchbyfield/:searchTerms/:returnFields/:searchLevel/:showHidden', {
            controller: 'SearchByFieldController',
            templateUrl: 'modules/search/views/searchbyfield.html'
        })
		
		.when('/register', {
			controller: 'RegisterController',
			templateUrl: 'modules/authentication/views/register.html',
			hideMenus: true
		})
		
		.when('/finishregistration/:id', {
			controller: 'FinishRegisterController',
			templateUrl: 'modules/authentication/views/finishregister.html',
			hideMenus: true
		})

        .when('/forgotusername', {
            controller: 'ForgotUsernameController',
            templateUrl: 'modules/authentication/views/forgotusername.html',
            hideMenus: true
        })

        .when('/forgotpassword', {
            controller: 'ForgotController',
            templateUrl: 'modules/authentication/views/forgotpassword.html',
            hideMenus: true
        })

        .when('/changepassword', {
            controller: 'ChangePasswordController',
            templateUrl: 'modules/authentication/views/changepassword.html',
            hideMenus: true
        })

		.when('/finishreset/:id', {
		    controller: 'FinishResetController',
		    templateUrl: 'modules/authentication/views/finishreset.html',
		    hideMenus: true
		})

		.when('/createuser', {
		    controller: 'CreateUserController',
		    templateUrl: 'modules/authentication/views/createuser.html',
		    hideMenus: true
		})

		.when('/editpermissions/:id', {
		    controller: 'EditPermissionGroupsController',
		    templateUrl: 'modules/authorization/views/permissions.html',
		    hideMenus: true
		})

		.when('/admin/editlists', {
		    controller: 'ListEditorController',
		    templateUrl: 'modules/administration/views/listeditor.html',
		    hideMenus: true
		})

		.when('/admin/editcommands', {
		    controller: 'CommandEditorController',
		    templateUrl: 'modules/administration/views/commandeditor.html',
		    hideMenus: true
		})

		.when('/admin/editcommands/:id', {
		    controller: 'DepartmentEditorController',
		    templateUrl: 'modules/administration/views/departmenteditor.html',
		    hideMenus: true
		})

		.when('/admin/editcommands/:id/:depId', {
		    controller: 'DivisionEditorController',
		    templateUrl: 'modules/administration/views/divisioneditor.html',
		    hideMenus: true
		})
 
        .otherwise({ redirectTo: '/' });
}])
 
.run(['$rootScope', '$location', '$localStorage', '$http', 'ConnectionService',
    function ($rootScope, $location, $localStorage, $http, ConnectionService) {
		// keep user logged in after page refresh
        $rootScope.globals = $localStorage.globals || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
		
		$rootScope.globals.loginMessages = [];
		$rootScope.globals.loginErrors = [];
		
		// whenever the location changes... 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
			// Show navigation when appropriate
			$rootScope.showNav = $location.path().indexOf('/login') == -1 && $location.path().indexOf('/register') == -1 && $location.path().indexOf('/finishregistration') == -1 && $location.path().indexOf('/forgotpassword') == -1 &&$location.path().indexOf('/finishreset') == -1;

            // redirect to login page if not logged in
            if ($location.path().indexOf('/login') == -1 && $location.path() !== '/resetlogin' && $location.path() !== '/register' && $location.path().indexOf('/finishregistration') == -1 && $location.path() !== '/forgotpassword' && $location.path() !== '/forgotusername' && $location.path().indexOf('/finishreset') == -1 && !$rootScope.globals.currentUser) {
                ConnectionService.AddLoginError("You must log in to see that page");
                ConnectionService.SetRedirectURL($location.url());
				$location.path('/login');
            }
			
        });
    }])
.filter('utc', function(){

  return function(val){
    var date = new Date(val);
    return new Date(date.getUTCFullYear(), 
                     date.getUTCMonth(), 
                     date.getUTCDate(),  
                     date.getUTCHours(), 
                     date.getUTCMinutes(), 
                     date.getUTCSeconds());
  };    

})
.directive('scroll', [function () {
    return {
        link: function (scope, element, attrs) {
            // ng-repeat delays the actual width of the element.
            // this listens for the change and updates the scroll bar
            function widthListener() {
                if (anchor.width() != lastWidth)
                    updateScroll();
            }

            function updateScroll() {
                // for whatever reason this gradually takes away 1 pixel when it sets the width.
                $div2.width(anchor.width() + 1);

                // make the scroll bars the same width
                $div1.width($div2.width());

                // sync the real scrollbar with the virtual one.
                $wrapper1.scroll(function () {
                    $wrapper2.scrollLeft($wrapper1.scrollLeft());
                });

                // sync the virtual scrollbar with the real one.
                $wrapper2.scroll(function () {
                    $wrapper1.scrollLeft($wrapper2.scrollLeft());
                });
            }

            var anchor = element.find('[data-anchor]'),
                lastWidth = anchor.width(),
                listener;

            // so that when you go to a new link it stops listening
            element.on('remove', function () {
                clearInterval(listener);
            });

            // creates the top virtual scrollbar
            element.wrapInner("<div class='div2' />");
            element.wrapInner("<div class='wrapper2' />");

            // contains the element with a real scrollbar
            element.prepend("<div class='wrapper1'><div class='div1'></div></div>");

            var $wrapper1 = element.find('.wrapper1'),
                $div1 = element.find('.div1'),
                $wrapper2 = element.find('.wrapper2'),
                $div2 = element.find('.div2');

            // force our virtual scrollbar to work the way we want.
            $wrapper1.css({
                width: "100%",
                border: "none 0px rgba(0, 0, 0, 0)",
                overflowX: "scroll",
                overflowY: "hidden",
                height: "20px"
            });

            $div1.css({
                height: "20px"
            });

            $wrapper2.css({
                width: "100%",
                overflowX: "scroll"
            });

            listener = setInterval(function () {
                widthListener();
            }, 650);

            updateScroll();
        }
    }
}]).directive('ngCustomDatePicker', function () {
    return {
        restrict: 'E',
        require: '^ngModel',
        scope: {
            ngModel: '=',
            disabled: '=ngDisabled'
        },
        template: '<div class="input-group">'+
                        '<input type="text" class="form-control" ng-disabled="disabled" uib-datepicker-popup="dd-MMMM-yyyy" ng-model="ngModel" is-open="opened" datepicker-options="dateOptions" close-text="Close" />' +
                        '<span class="input-group-btn">'+
                            '<button type="button" class="btn btn-default" ng-disabled="disabled" ng-click="openPicker()"><i class="glyphicon glyphicon-calendar"></i></button>'+
                        '</span>'+
                  '</div>',
        controller: ['$scope', function ($scope) {
            $scope.opened = false;

            $scope.openPicker = function () {
                $scope.opened = true;
            };

            $scope.dateOptions = {
                startingDay: 1
            };

        }]
    }
}).directive('ngSearchField', function(){
    return {
        restrict: 'E',
        require: '^ngModel',
        scope: {
            ngModel: '=',
            fieldType: '=',
            fieldName: '='
        },
        template: '<div class="input-group">' +
        '<span class="input-group-addon" id="searchAddon{{fieldName}}">{{fieldName}}<span ng-if="fieldType == \'DateTime\'"><br>(From/To)</span></span>'+
        '<input ng-if="fieldType == \'String\'" type="text" class="form-control" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName]">' +
        '<ng-custom-date-picker ng-if="fieldType == \'DateTime\'" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName][0][\'From\']"></ng-custom-date-picker> '+
        '<ng-custom-date-picker ng-if="fieldType == \'DateTime\'" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName][0][\'To\']"></ng-custom-date-picker>'+
        '<input ng-if="fieldType != \'String\' && fieldType != \'DateTime\'" type="text" value="This field is not searchable" class="form-control" aria-describedby="searchAddon{{fieldName}}" disabled>'+
        '</div>',
        controller: ['$scope', function ($scope) {
            if($scope.fieldName.indexOf('Date') != -1) { // TODO: figure out why the damn fieldName variable shows up when logging $scope, but not when called directly
                if($scope.ngModel[$scope.fieldName] && $scope.ngModel[$scope.fieldName][0]) {

                    if($scope.ngModel[$scope.fieldName][0].From){
                        $scope.ngModel[$scope.fieldName][0].From = new Date($scope.ngModel[$scope.fieldName][0].From);
                    } else {
                        $scope.ngModel[$scope.fieldName][0].From = null;
                        delete $scope.ngModel[$scope.fieldName][0].From;
                    }
                    if($scope.ngModel[$scope.fieldName][0].To){
                        $scope.ngModel[$scope.fieldName][0].To = new Date($scope.ngModel[$scope.fieldName][0].To);
                    } else {
                        $scope.ngModel[$scope.fieldName][0].To = null;
                        delete $scope.ngModel[$scope.fieldName][0].To;
                    }
                } else {
                    $scope.ngModel[$scope.fieldName] = [];
                }

            }

        }]
    }
})
    /*.controller('DatepickerPopupCtrl', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.openPicker = function () {
        $scope.popup.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = 'dd-MMMM-yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
          date: tomorrow,
          status: 'full'
      },
      {
          date: afterTomorrow,
          status: 'partially'
      }
    ];

    function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
})*/;
/*****************
 File division
*****************/
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
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

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
        };

        $scope.deleteListItem = function (listItem, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteListItem(listItem.Id, $scope.selectedList, forceDelete,
                function (response) {
                    $scope.loadLists();
                    $scope.messages.push("Item successfully deleted.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

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
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.addCommand = function (value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddCommand(value, description,
                function (response) {
                    $scope.loadCommands();
                    $scope.messages.push("Command '" + value + "' successfully added.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.deleteCommand = function (commandid, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteCommand(commandid, forceDelete,
                function (response) {
                    $scope.loadCommands();
                    $scope.messages.push("Command successfully deleted.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.updateCommand = function (id, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditCommand(id, value, description,
                function (response) {
                    $scope.loadCommands();
                    $scope.messages.push("Command successfully updated.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
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
            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );

        $scope.loadDepartments = function () {
            AdministrationService.LoadDepartments($routeParams.id,
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.departments = response.ReturnValue.Department;
                    if(config.debugMode) console.log(response.ReturnValue.Department);
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.addDepartment = function (value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddDepartment($routeParams.id, value, description,
                function (response) {
                    $scope.loadDepartments();
                    $scope.messages.push("Department '" + value + "' successfully added.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.deleteDepartment = function (departmentid, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteDepartment(departmentid, forceDelete,
                function (response) {
                    $scope.loadDepartments();
                    $scope.messages.push("Department successfully deleted.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.updateDepartment = function (id, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditDepartment($routeParams.id, id, value, description,
                function (response) {
                    $scope.loadDepartments();
                    $scope.messages.push("Department successfully updated.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
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
            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );

        AdministrationService.LoadCommand($routeParams.id,
            function (response) {
                $scope.command = response.ReturnValue;
            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );

        $scope.loadDivisions = function () {
            AdministrationService.LoadDivisions($routeParams.depId,
                function (response) {
                    $scope.errors = [];
                    $scope.dataLoading = false;
                    $scope.divisions = response.ReturnValue.Division;
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.addDivision = function (value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.AddDivision($routeParams.depId, value, description,
                function (response) {
                    $scope.loadDivisions();
                    $scope.messages.push("Division '" + value + "' successfully added.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.deleteDivision = function (divisionid, forceDelete) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.DeleteDivision(divisionid, forceDelete,
                function (response) {
                    $scope.loadDivisions();
                    $scope.messages.push("Division successfully deleted.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.updateDivision = function (id, value, description) {
            $scope.errors = [];
            $scope.messages = [];
            AdministrationService.EditDivision($routeParams.depId, id, value, description,
                function (response) {
                    $scope.loadDivisions();
                    $scope.messages.push("Division successfully updated.");
                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };


        $scope.loadDivisions();

    }
    ]
);
/*****************
 File division
*****************/
'use strict';
 
angular.module('Administration')
 
.factory('AdministrationService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};

        service.LoadEditableLists = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', {'editable':true, 'exclude':true, 'entitynames':['Division', 'Department', 'Command']}, success, error);
        };

        service.AddListItem = function (listname, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': listname, 'item': {'value': value, 'description': description} }, success, error);
        };

        service.EditListItem = function (listitemid, value, description, listname, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':listname, 'item': {'value': value, 'description': description, 'id': listitemid } }, success, error);
        };

        service.DeleteListItem = function (listitemid, listname, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'forcedelete' : forcedelete, 'entityname':listname, 'id': listitemid }, success, error);
        };


        service.LoadCommands = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Command'] }, success, error);
        };

        service.AddCommand = function (value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': 'Command', 'item': {'value': value, 'description': description }}, success, error);
        };

        service.EditCommand = function (commandid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': 'Command', 'id': commandid, 'item': {'value': value, 'description': description,  'id': commandid} }, success, error);
        };

        service.DeleteCommand = function (commandid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname': 'Command', 'forcedelete': forcedelete, 'id': commandid }, success, error);
        };

        service.LoadCommand = function (commandid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Command'], 'id' : commandid }, success, error);
        };


        service.LoadDepartments = function (commandid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Department'], 'commandid' : commandid }, success, error);
        };

        service.AddDepartment = function (commandid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Department', 'item': {'commandid': commandid, 'value': value, 'description': description }}, success, error);
        };

        service.EditDepartment = function (commandid, departmentid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Department', 'item': {'value': value, 'description': description, 'id': departmentid, 'commandid':commandid} }, success, error);
        };

        service.DeleteDepartment = function (departmentid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname' :'Department', 'forcedelete': forcedelete, 'id': departmentid }, success, error);
        };

        service.LoadDepartment = function (departmentid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Department'], 'id': departmentid }, success, error);
        };

        service.LoadDivisions = function (departmentid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Division'], 'departmentid': departmentid }, success, error);
        };

        service.AddDivision = function (departmentid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Division', 'item': {'departmentid': departmentid, 'value': value, 'description': description }}, success, error);
        };

        service.EditDivision = function (departmentid, divisionid, value, description, success, error) {
            return ConnectionService.RequestFromBackend('UpdateOrInsertReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname':'Division', 'item': {'value': value, 'description': description, 'id': divisionid, 'departmentid':departmentid} }, success, error);
        };

        service.DeleteDivision = function (divisionid, forcedelete, success, error) {
            return ConnectionService.RequestFromBackend('DeleteReferenceList', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entityname' :'Division', 'forcedelete': forcedelete, 'id': divisionid }, success, error);
        };

        service.LoadDivision = function (divisionid, success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'entitynames':['Division'], 'id': divisionid }, success, error);
        };
      
        return service;
    }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ModalService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ModalService, ConnectionService, config) {
        // Reset login status
        AuthenticationService.ClearCredentials();

        // Display error messages and messages stored in the AuthenticationService
        $scope.errors = ConnectionService.GetLoginErrors();
        $scope.messages = ConnectionService.GetLoginMessages();
        ConnectionService.ClearLoginErrors();
        ConnectionService.ClearLoginMessages();

        // When they click login...
        $scope.login = function () {
            // Show that data is loading and clear the error message
            $scope.dataLoading = true;
            $scope.errors = [];

            ModalService.showModal({
                templateUrl: 'modules/modals/views/privacyact.html',
                controller: "ModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {

                        AuthenticationService.Login($scope.username, $scope.password,
                            // If we succeed this is our call back
                            function (response) {
                                if(config.debugMode) console.log(response);
                                AuthenticationService.SetCredentials($scope.username, response.ReturnValue.AuthenticationToken, response.ReturnValue.PersonId);
                                AuthorizationService.SetPermissions(response.ReturnValue.ResolvedPermissions);
                                AuthorizationService.GetPermissionGroups(
                                        // If we succeed, this is our callback
                                        function (response) {
                                            AuthorizationService.SetPermissionGroups(response.ReturnValue);
                                        },
                                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                                        function (response) {
                                            ConnectionService.HandleServiceError(response, $scope, $location);
                                        }
                                    )
                                    .then(function () {
                                        var test = ConnectionService.GetRedirectURL();
                                        ConnectionService.ClearRedirectURL();
                                        if(config.debugMode) console.log(test);
                                        $location.path(test);
                                    });
                            },
                            // If we fail, this is our call back. This one must differ from the convenience function in Connection service because we
                            // are already on the login page. 
                            function (response) {
                                // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                                // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                                if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                                    for (var i = 0; i < response.ErrorMessages.length; i++) {
                                        ConnectionService.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                                    }
                                    AuthenticationService.ClearCredentials();
                                    $location.path('/login');
                                    // Since we're already at the login page, go ahead and get the Errors.
                                    $scope.errors = ConnectionService.GetLoginErrors();
                                    ConnectionService.ClearLoginErrors();
                                } else {
                                    // If it's any other type of error, we can just show it to them on this page.
                                    $scope.errors = response.ErrorMessages;
                                }
                                $scope.dataLoading = false;

                            }
                        );
                    } else {
                        $scope.dataLoading = false;
                        $scope.errors.push("You must accept the Privacy Act Statement to continue");
                    }
                });
            });
        };
    }])
.controller('RegisterController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
        // reset login status
        //AuthenticationService.ClearCredentials();
        $scope.accepted = null;
        $scope.beginRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.BeginRegistration($scope.password,
                function (response) {
                    $scope.accepted = true;
                    $scope.dataLoading = false;

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])

.controller('FinishRegisterController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ConnectionService, config) {
        $scope.finishRegistration = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishRegistration($scope.username, $scope.password, $routeParams.id,
                function (response) {
                    ConnectionService.AddLoginMessage("Account created. Login with your new account");
                    $location.path('/login');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])
    .controller('ForgotController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
                // reset login status
                // AuthenticationService.ClearCredentials();

                $scope.forgotpassword = function () {
                    $scope.dataLoading = true;
                    $scope.errors = null;
                    AuthenticationService.ForgotPassword($scope.email, $scope.ssn,
                        function (response) {
                            $scope.confirmation = "Got it. Check your .mil email for further instructions.";
                            $scope.dataLoading = false;

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };
            }])
    .controller('ForgotUsernameController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
                // reset login status
                // AuthenticationService.ClearCredentials();

                $scope.forgotusername = function () {
                    $scope.dataLoading = true;
                    $scope.errors = null;
                    AuthenticationService.ForgotUsername($scope.ssn,
                        function (response) {

                            ConnectionService.AddLoginMessage("Your username was sent to your .mil email.");
                            $location.path('/login');

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };
            }])
    .controller('ChangePasswordController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, AuthenticationService, ConnectionService, config) {
                $scope.changePassword = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.ChangePassword($scope.oldPassword, $scope.newPassword,
                        function (response) {
                            ConnectionService.AddLoginMessage("Password successfully changed. Please log in with your new password.");
                            $location.path('/login');

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };
            }])
	.controller('FinishResetController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ConnectionService, config) {
        $scope.finishReset = function () {
            $scope.dataLoading = true;
            AuthenticationService.FinishReset($scope.password, $routeParams.id,
                function (response) {
                    ConnectionService.AddLoginMessage("Password reset. Please login with your new password.");
                    $location.path('/login');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])
	.controller('CreateUserController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, ConnectionService, config) {

        $scope.errors = [];
        $scope.messages = [];
        ProfileService.GetAllLists(
            // If we succeed, this is our call back
            function (response) {
                $scope.lists = response.ReturnValue;

            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
            function (response) {
                ConnectionService.HandleServiceError(response, $scope, $location);
            }
        );

        $scope.trimString = function (str) {
            if (str) {
                return str.replace(/^\s+|\s+$/g, '');
            }
            return '';
        };

        $scope.isValidSSN = function (number) {
            var re = /^\d{3}-?\d{2}-?\d{4}$/;
            return re.test(number);
        };

        $scope.createUser = function () {
            $scope.errors = [];
            $scope.messages = [];
            $scope.dataLoading = true;
            AuthenticationService.CreateUser($scope.newUser,
                function (response) {
                    $scope.messages.push("User created. Please instruct them to register their account.");
                    $scope.dataLoading = false;
                    $location.path('/profile/' + response.ReturnValue);

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }]);
/*****************
 File division
*****************/
'use strict';
 
angular.module('Authentication')
 
.factory('AuthenticationService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, ConnectionService) {
        var service = {};

        /**
         * Calls the Login endpoint
         * @param {String} username
         * @param {String} password
         * @param {Function} success
         * @param {Function} error
         */
        service.Login = function (username, password, success, error) {
            return ConnectionService.RequestFromBackend('Login', { 'username': username, 'password': password }, success, error);
        };

        /**
         *
         * @param {Function} success
         * @param {Function} error
         */
		service.Logout = function (success, error) {
		    return ConnectionService.RequestFromBackend('Logout', { 'authenticationtoken': service.GetAuthToken()}, success, error);
		};

        /**
         *
         * @param {String} username
         * @param {String} password
         * @param {String} id
         * @param {Function} success
         * @param {Function} error
         * @constructor
         */
		service.FinishRegistration = function (username, password, id, success, error) {
		    return ConnectionService.RequestFromBackend('CompleteRegistration', { 'username': username, 'password': password, 'accountconfirmationid': id }, success, error);
		};

		service.BeginRegistration = function (ssn, success, error) {
		    return ConnectionService.RequestFromBackend('BeginRegistration', { 'ssn': ssn, 'continuelink' : 'https://commandcentral/#/finishregistration/'}, success, error);
		};

		service.CreateUser = function (person, success, error) {
		    return ConnectionService.RequestFromBackend('CreatePerson', { 'authenticationtoken': service.GetAuthToken(), 'person': person }, success, error);
		};

		service.ForgotPassword = function (email, ssn, success, error) {
			return ConnectionService.RequestFromBackend('BeginPasswordReset', { 'email': email, 'ssn': ssn, 'continuelink' : 'https://commandcentral/#/finishreset/' }, success, error);
		};

		service.ForgotUsername = function (ssn, success, error) {
			return ConnectionService.RequestFromBackend('ForgotUsername', { 'ssn': ssn }, success, error);
		};

		service.FinishReset = function (password, id, success, error) {
			return ConnectionService.RequestFromBackend('CompletePasswordReset', { 'PasswordResetid': id, 'Password': password }, success, error);
		};

		service.ChangePassword = function (oldPassword, newPassword, success, error) {
			return ConnectionService.RequestFromBackend('ChangePassword', { 'authenticationtoken': service.GetAuthToken(), 'oldpassword': oldPassword, 'newpassword': newPassword }, success, error);
		};
		
        service.SetCredentials = function (username, authtoken, userID) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authtoken: authtoken,
					userID: userID
                }
            };
 
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $localStorage.globals = $rootScope.globals;
        };
 
        service.ClearCredentials = function () {
            delete $rootScope.globals.currentUser;
            delete $localStorage.globals;
            //$http.defaults.headers.common.Authorization = 'Basic ';
        };

        /**
         * @return {String}
         */
        service.GetAuthToken = function () {
			if( $localStorage.globals && $localStorage.globals.currentUser && $localStorage.globals.currentUser.authtoken){
				return $localStorage.globals.currentUser.authtoken;
			} else {
				return null;
			}
				
		};

        /**
         * @return {Object}
         */
        service.GetCurrentUserID = function () {
		    if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.userID) {
				return $rootScope.globals.currentUser.userID;
			} else {
				return null;
			}
		
		};
 
        return service;
    }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Authorization')

.controller('AuthorizationController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService) {

    }
    ]
)
.controller('EditPermissionGroupsController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'ConnectionService', 'config',
function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, ConnectionService, config) {
            AuthorizationService.GetUserPermissionGroups($routeParams.id,
                function (response) {
                    $scope.errors = [];
                    $scope.messages = [];
                    $scope.personId = $routeParams.id;
                    $scope.friendlyName = response.ReturnValue.FriendlyName;
                    $scope.allPermissionGroups = response.ReturnValue.AllPermissionGroups;
                    if(config.debugMode) console.log($scope.allPermissionGroups);
                    $scope.userPermissionGroups = response.ReturnValue.CurrentPermissionGroups;
                    if(config.debugMode) console.log($scope.userPermissionGroups);
                    $scope.editablePermissionGroups = response.ReturnValue.EditablePermissionGroups;

                    $scope.givePermissionGroup = function (group) {
                        for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                            if ($scope.userPermissionGroups[i] == group) {
                                $scope.errors.push('User already has this permission.');
                                return;
                            }
                        }
                        $scope.userPermissionGroups.push(group);
                    };

                    $scope.removePermissionGroup = function (group) {
                        for (var i = 0; i < $scope.userPermissionGroups.length; i++) {
                            if ($scope.userPermissionGroups[i] == group) {
                                $scope.userPermissionGroups.splice(i, 1);
                            }
                        }
                    };

                    $scope.canEditPermissionGroup = function (group) {
                        for (var i = 0; i < $scope.editablePermissionGroups.length; i++) {
                            if ($scope.editablePermissionGroups[i] == group) {
                                return true;
                            }
                        }
                        return false;
                    };

                    $scope.updatePermissions = function () {
                        $scope.errors = [];
                        $scope.messages = [];

                        AuthorizationService.UpdateUserPermissionGroups($routeParams.id, $scope.userPermissionGroups,
                            function (response) {
                                $scope.messages.push('Permissions successfully updated.');
                                if (response.ReturnValue.WasSelf) {
                                    ConnectionService.AddLoginError("Your permissions have changed. Please re-login.");
                                    ConnectionService.ClearCredentials();
                                    $location.path('/login');
                                }

                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );

                    };

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );

        }
    ]
);
/*****************
 File division
*****************/
'use strict';
 
angular.module('Authorization')
 
.factory('AuthorizationService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService', 'config',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService, config) {
        var service = {};

        service.GetUserPermissionGroups = function (personid, success, error) {
            return ConnectionService.RequestFromBackend('LoadPermissionGroupsByPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
        };

        service.UpdateUserPermissionGroups = function (personid, groups, success, error) {
            return ConnectionService.RequestFromBackend('UpdatePermissionGroupsByPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid, 'permissiongroups': groups }, success, error);
        };

        service.GetPersonMetadata = function (success, error) {
            return ConnectionService.RequestFromBackend('GetPersonMetadata', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };
		
        service.GetPermissionGroups = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadPermissionGroups', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        /** @return Boolean **/
        service.CanCreatePerson = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('CreatePerson') != -1;

            } catch (err){
                return false;
            }
        };

        /** @return Boolean **/
        service.CanEditNews = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('EditNews') != -1;

            } catch (err){
                return false;
            }
        };

        /** @return Boolean **/
        service.CanUseAdminTools = function () {
            try {
                return $rootScope.globals.currentUser.permissions.AccessibleSubmodules.indexOf('AdminTools') != -1;

            } catch (err){
                return false;
            }
        };

        service.SetPermissions = function (newPermissions) {
            $rootScope.globals.currentUser.permissions = newPermissions;
 
            $localStorage.globals = $rootScope.globals;
        };
		
		service.SetPermissionGroups = function (permsGroupArray) {
            $rootScope.globals.currentUser.permissionGroups = permsGroupArray;

            $localStorage.globals = $rootScope.globals;
        };

        /**
         *
         * @param {String} level
         * @returns {string|Array.<T>}
         *
         */
		service.GetReturnableFields = function(level) {
            var universalFields = $rootScope.globals.currentUser.permissions.ReturnableFields.Main.Person;
            var specificFields = $rootScope.globals.currentUser.permissions.PrivelegedReturnableFields.Main[level];
            var combinedFields = universalFields.concat(specificFields.filter(function (item) {
                return universalFields.indexOf(item) < 0;
            }));
            var levelIndex = combinedFields.indexOf(level);
            if(config.debugMode) console.log(level);
            if(config.debugMode) console.log(levelIndex);
            if( levelIndex >= 0) {
                combinedFields.splice(levelIndex, 1);
            }
			return combinedFields;
		};
 
        return service;
    }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Connection')

.controller('SetPortController',
    ['$scope', '$rootScope', 'ConnectionService', 'config',
        function ($scope, $rootScope, ConnectionService, config) {
            $scope.setPort = function (thePort) { ConnectionService.SetBackendPort(thePort); $scope.currentURL = $scope.getCurrentUrl() };
            $scope.getCurrentUrl = function () { return ConnectionService.GetBackendURL(); };
            $scope.currentURL = $scope.getCurrentUrl();
            $scope.showPortController = config.debugMode;
        }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Connection')

    .factory('ConnectionService',
        ['$http', '$localStorage', '$rootScope', 'config',
            function ($http, $localStorage, $rootScope, config) {
                var service = {};
                var redirectURL = '';
                // Information for connecting to the database, including the URL and API key.
                var apikey = config.apiKey;
                //var backendURL = "http://73.20.152.170";  // Atwood's IP for working at home.
                //var backendURL = "http://147.51.62.19";     // Dev service IP.
                //var backendURL = "https://147.51.62.48:1337";     // Live service IP.
                //var backendURL = "http://192.168.1.234";
                var backendURL = config.backendURL;
                //var backendURL = "http://192.168.1.196";

                // Here we check to see if we have a port stored in localStorage, and if not, we use 1113.
                // If it's enabled, there's a widget at the bottom of index.html, controlled by this module,
                // that allows the user to set the port to look for the service on. This is for development,
                // and must be disabled before live launch.
                var backendPort;
                if ($localStorage.backendPort) {
                    backendPort = $localStorage.backendPort;
                } else {
                    backendPort = config.backendPort;
                }

                if(!config.debugMode) backendPort = config.backendPort;

                // Create the base URL for all REST calls
                var baseurl = backendURL + ":" + backendPort;

                // If you can't figure out what this does, stop reading and go get an adult.
                /**
                 * @return {string}
                 */
                service.GetBackendURL = function () {
                    return backendURL + ":" + backendPort;
                };

                // This too.
                service.SetBackendPort = function (portnumber) {
                    backendPort = portnumber;
                    baseurl = backendURL + ":" + backendPort;
                    $localStorage.backendPort = portnumber;
                };

                // Ditto
                /**
                 * @return {string}
                 */
                service.GetAPIKey = function () {
                    return apikey;
                };

                // Login page error displaying. This seems like it should be in the Authentication module, but actually this is part of backend service error handling, and
                // belongs here. Also, keeping it here prevents a circular dependancy between Authentication and Connection.

                service.AddLoginMessage = function (loginMessage) {
                    if ($rootScope.globals.loginMessages) {
                        $rootScope.globals.loginMessages.push(loginMessage);
                    } else {
                        $rootScope.globals.loginMessages = [loginMessage];
                    }
                };

                service.ClearLoginMessages = function () {
                    $rootScope.globals.loginMessages = [];
                };

                service.GetLoginMessages = function () {
                    return $rootScope.globals.loginMessages;
                };

                service.SetRedirectURL = function (url) {
                    redirectURL = url;
                };
                service.ClearRedirectURL = function () {
                    redirectURL = '';
                };

                /**
                 * @return {string}
                 */
                service.GetRedirectURL = function () {
                    return redirectURL;
                };

                service.AddLoginError = function (loginError) {
                    if ($rootScope.globals.loginErrors) {
                        $rootScope.globals.loginErrors.push(loginError);
                    } else {
                        $rootScope.globals.loginErrors = [loginError];
                    }
                };

                service.ClearLoginErrors = function () {
                    $rootScope.globals.loginErrors = [];
                };

                service.GetLoginErrors = function () {
                    return $rootScope.globals.loginErrors;
                };


                service.ClearCredentials = function () {
                    delete $rootScope.globals.currentUser;
                    delete $localStorage.globals
                };

                // This is a convenience function. Just about every controller handles service errors the same way, so we just feed this
                // function the appropriate $scope and the $location service and let it handle the work. The Authentication controller has
                // a customized version of this for handling errors when we're already on the login page.
                service.HandleServiceError = function (response, scope, location) {
                    // If we tried to do something we can't, or didn't authenticate properly, something might be very wrong. Delete
                    // The stored credentials and kick them back to login page, displaying all appropriate error messages.
                    if (response.ErrorType == "Authentication" || response.ErrorType == "Authorization") {
                        for (var i = 0; i < response.ErrorMessages.length; i++) {
                            service.AddLoginError("The service returned an error: " + response.ErrorMessages[i]);
                        }
                        service.ClearCredentials();
                        service.SetRedirectURL(location.url());
                        location.path('/login');
                    } else {
                        // If it's any other type of error, we can just show it to them on this page.
                        scope.errors = response.ErrorMessages;
                    }
                    scope.dataLoading = false;

                };

                /** @param {String} endpoint
                 * @param {Function} success
                 * @param {Function} error
                 * @param {Object} params **/
                service.RequestFromBackend = function (endpoint, params, success, error) {
                    var reqData = { 'apikey': service.GetAPIKey() };
                    for (var attrname in params) { reqData[attrname] = params[attrname]; } // Merge params into our reqData

                    var serviceurl = service.GetBackendURL() + "/" + endpoint; // Make the url we need

                    var request = {
                        method: 'POST',
                        url: serviceurl,
                        data: reqData,
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8;'
                        }
                    };

                    return $http(request).then(function (response) { // The return here is important. $http returns a promise, and the controllers need that.
                            success(service.RestoreJsonNetReferences(JSON.parse(response.data)));
                            if(config.debugMode) console.log(endpoint);
                            if(config.debugMode) console.log(service.RestoreJsonNetReferences(response.data));
                        },
                        function (response) {
                            if (response.statusText == "") {
                                error({ "ErrorType": "Authentication", "ErrorMessages": ["The service is offline. If this message persists, please contact the developers."] });
                            } else {
                                error(service.RestoreJsonNetReferences(JSON.parse(response.data)));
                            }
                        });
                };

                service.RestoreJsonNetReferences = function (theJSON) {
                    if (typeof theJSON === "string") { theJSON = JSON.parse(theJSON); }

                    // We declare these up here and have a nested function so that we can keep track of some global things while we recurse.
                    var originals = {};
                    var failures = [];

                    /**
                     * Fixes JSON objects that have the $id kind of circular references.
                     * @param {Object} theObject
                     * @param {Array} oldParents
                     * @returns {Object}
                     */
                    function fixTheObject(theObject, oldParents) {
                        // Base Case: If it's primitive or an empty object, just return it.
                        if (typeof theObject !== 'object' || !theObject) { return theObject; }

                        // Create a new copy of the array we were passed. This is because it's (obviously) passed by reference, and we don't want to modify the
                        // Parents array of the previous level, as we may be iterating over an array somewhere down the recursion chain, and don't want one array
                        // item's parents to affect another.
                        var theParents = oldParents.slice();

                        // If it is an array, it will be represented as an object with a "$values" property containing the array, and an "$id".
                        // If it's an array...
                        if (theObject.hasOwnProperty("$values")) {

                            // ...create an array of corrected values, and use that.
                            var newArray = [];

                            // Add this object/array to the Parents before we iterate over its values.
                            theParents.push(theObject["$id"]);

                            for (var j in theObject["$values"]) {
                                newArray.push(fixTheObject(theObject["$values"][j], theParents));
                            }

                            // If it's an array, it will have an $id. If it doesn't, the object isn't from JSON.net, and this code SHOULD break,
                            // so I'm not checking for it. That's your job. :D
                            // Store the array in the array of $id/object pairs in case we need it again.
                            originals[theObject["$id"]] = newArray;

                            return newArray;
                        }

                        // If we have "$id", then we're an original copy of an object. Remove that $id, iterate over the object and fix its
                        // properties, then store it by its $id in our originals. This could be combined with the final case at the end of this
                        // function, but it looks weird and feels wrong, soo nanny-nanny poo-poo, I'm not doing it.
                        if ("$id" in theObject) {
                            // Save the id before we delete it from the object so we can use it as a key in the originals array.
                            var id = theObject["$id"];
                            delete theObject["$id"];
                            theParents.push(id);

                            // Fix all the properties of the object recursively
                            for (var k in theObject) {
                                theObject[k] = fixTheObject(theObject[k], theParents);
                            }

                            // Store this object in the array of originals for use later
                            originals[id] = theObject;

                            return theObject;
                        }

                        // If it has a "$ref" property, we have to go get it from our array of stored objects.
                        if ("$ref" in theObject) {
                            // If this $ref exists in our Parents array, then we have a circular definition. Return a blank object to prevent an infinite loop.
                            if (theParents.indexOf(theObject["$ref"]) != -1) { return {}; }

                            // If not, and the $ref is in our originals array, return that.
                            if (theObject["$ref"] in originals) {
                                return originals[theObject["$ref"]];
                            }

                            // If we didn't hit the return statements above, that means this object hasn't be discovered yet. This shouldn't happen,
                            // but we're good little programmers who protect against theoretically possible edge cases. So we store it to be fixed later.
                            failures.push(theObject);
                        }

                        // If we get here, this object is untouched by JSON.net. Just to be sure, we'll check all its properties, but really we just
                        // need to return the object.
                        for (var i in theObject) {
                            theObject[i] = fixTheObject(theObject[i], theParents);
                        }
                        return theObject;

                    }

                    // Now just go through our failures and fill them in.
                    for (var i in failures) {
                        failures[i] = originals[failures[i]["$ref"]];
                    }

                    return fixTheObject(theJSON, []);

                };


                return service;
            }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'HomeService', 'ConnectionService', 'config',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, HomeService, ConnectionService, config) {

        $scope.pdfUrl = "/img/pow.pdf";
        $scope.refreshNews = function () {
            $scope.dataLoading = true;
            $scope.errors = null;
            HomeService.GetHomeNews(
                function (response) {
                    $scope.dataLoading = false;
                    $scope.newsItems = response.ReturnValue;
                    $scope.loadedTime = new Date;
                },
		        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.deleteNewsItem = function (itemID) {
            $scope.dataLoading = true;
            $scope.errors = null;
            HomeService.DeleteNewsItem(itemID,
                function (response) {
                    $scope.refreshNews();

                },
		        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };

        $scope.userCanEditNews = function () { return AuthorizationService.CanEditNews(); };
        $scope.refreshNews();

    }])

.controller('CreateNewsController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'HomeService', 'ConnectionService',
    function ($scope, $rootScope, $location, AuthenticationService, HomeService, ConnectionService) {
        $scope.saveNewsItem = function (title, text) {
            HomeService.CreateNewsItem(title, text.match(/[^\r\n]+/g),
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }])
.controller('UpdateNewsController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'HomeService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, HomeService, ConnectionService) {

        $scope.dataLoading = true;
        $scope.errors = null;
        HomeService.LoadNewsItem($routeParams.id,
            function (response) {
                $scope.dataLoading = false;
                $scope.newsItem = response.ReturnValue;
                $scope.text = $scope.newsItem.Paragraphs.join('\n');

            },
            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
        );

        $scope.updateNewsItem = function (newsItem, text) {
            $scope.errors = null;
            $scope.dataLoading = true;
            var newsItemDTO = {};
            newsItemDTO.Paragraphs = text.match(/[^\r\n]+/g);
            newsItemDTO.Title = newsItem.Title;
            newsItemDTO.NewsItemId = newsItem.Id;
            HomeService.UpdateNewsItem(newsItemDTO,
                function (response) {
                    $scope.dataLoading = false;
                    $location.path('/');

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
    }]);
/*****************
 File division
*****************/
'use strict';
 
angular.module('Home')
 
.factory('HomeService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
		
        service.GetHomeNews = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadNewsItems', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
		};

        service.LoadNewsItem = function (itemID, success, error) {
            return ConnectionService.RequestFromBackend('LoadNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': itemID}, success, error);
		};

        service.CreateNewsItem = function (title, paragraphs, success, error) {
            return ConnectionService.RequestFromBackend('CreateNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'Title': title, 'Paragraphs': paragraphs }, success, error);
        };

        service.UpdateNewsItem = function (newsItem, success, error) {
            return ConnectionService.RequestFromBackend('UpdateNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': newsItem.NewsItemId, 'paragraphs': newsItem.Paragraphs, 'title': newsItem.Title }, success, error);
		};

        service.DeleteNewsItem = function (itemID, success, error) {
            return ConnectionService.RequestFromBackend('DeleteNewsItem', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'newsitemid': itemID }, success, error);
		};

        return service;
    }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Modals')

.controller('ModalServiceController',
    ['$scope', 'ModalService',
    function ($scope, ModalService) {
        $scope.show = function () {
            return ModalService.showModal({
                templateUrl: 'modules/modals/views/pii.html',
                controller: "ModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $scope.message = "You said " + result;
                });
            },
            function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $scope.message = "You said " + result;
                });
            },
            function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $scope.message = "You said " + result;
                });
            });
        };

        $scope.show();
    }]
)
.controller('ModalController', ['$scope', 'close', function ($scope, close) {

    $scope.close = function (result) {
        close(result, 250); // close, but give 500ms for bootstrap to animate
        $('.modal-backdrop').hide(); 
    };

}]);
/*****************
 File division
*****************/
'use strict';

angular.module('Muster')

    .controller('MusterController',
        ['$scope', '$filter', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $filter, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {

                // This scope will just about always contain PII
                $rootScope.containsPII = true;
                $scope.divisions = [];
                //$scope.fields = ['FriendlyName', 'Paygrade', 'Division', 'HasBeenMustered'];
                $scope.errors = [];
                $scope.messages = [];

                var oldStatusList = [];
                $scope.itemsPerPage = "50";
                $scope.currentPage = 1;
                $scope.newStatusList = [];
                $scope.groupCount = 0;

                // The default sorting key
                $scope.orderKey = "Division";
                $scope.selectedDivision = "All";

                $scope.pageCount = function () {
                    return Math.ceil($scope.friends.length / $scope.itemsPerPage);
                };

                $scope.makeDisplayList = function() {
                    var begin = (parseInt($scope.currentPage, 10) - 1) * parseInt($scope.itemsPerPage, 10);
                    var end = parseInt(begin, 10) + parseInt($scope.itemsPerPage, 10);
                    $scope.newStatusList = $filter('orderBy')($scope.newStatusList, $scope.orderKey);



                    // FILTER FOR GROUP HERE
                    if ($scope.selectedDivision == 'All') {
                        $scope.groupCount = $scope.newStatusList.length;
                        $scope.unmusteredSailorsList = $filter('filter')($scope.newStatusList, { HasBeenMustered: false }, true);
                        if ($scope.showUnmustered) {
                            $scope.displayList = $scope.unmusteredSailorsList.slice(begin, end)
                        } else {
                            $scope.displayList = $scope.newStatusList.slice(begin, end);
                        }
                    } else {
                        var sailorsInThisGroup = $filter('filter')($scope.newStatusList, { Division : $scope.selectedDivision });
                        $scope.groupCount = sailorsInThisGroup.length;
                        $scope.unmusteredSailorsList = $filter('filter')(sailorsInThisGroup, { HasBeenMustered: false });
                        if ($scope.showUnmustered) {
                            $scope.displayList = $scope.unmusteredSailorsList.slice(begin, end)
                        } else {
                            $scope.displayList = sailorsInThisGroup.slice(begin, end);
                        }
                    }
                };

                $scope.$watch('currentPage + itemsPerPage + setOrder + newStatusList + orderKey + showUnmustered', function () {
                    $scope.makeDisplayList();
                });

                ProfileService.GetAllLists(
                    // If we succeed, this is our call back
                    function (response) {
                        $scope.musterStatuses = response.ReturnValue.MusterStatus;

                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );

                var loadMuster = function() {
                    $scope.dataLoading = true;
                    MusterService.LoadTodaysMuster(
                    function (response) {

                        $scope.dataLoading = false;
                        $scope.errors = [];
                        $scope.messages= [];
                        // Create the divisions array
                        for (var j = 0; j < response.ReturnValue.Musters.length; j++) {
                            if ($scope.divisions.indexOf(response.ReturnValue.Musters[j].Division) == -1) {
                                $scope.divisions.push(response.ReturnValue.Musters[j].Division);
                            }
                        }

                        $scope.newStatusList = response.ReturnValue.Musters;

                        oldStatusList = angular.copy(response.ReturnValue.Musters);

                        $scope.makeDisplayList();

                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }

                );};

                loadMuster();

                $scope.submitMuster = function (musterList) {
                    var dtoMuster = {};
                    for (var i = 0; i < musterList.length; i++) {
                        if (musterList[i].CurrentMusterStatus.MusterStatus != null && musterList[i].CurrentMusterStatus.MusterStatus != $filter('filter')(oldStatusList, {Id: musterList[i].Id})[0].CurrentMusterStatus.MusterStatus) {
                            dtoMuster[musterList[i].Id] = musterList[i].CurrentMusterStatus.MusterStatus;
                        }
                    }

                    $scope.messages = [];
                    $scope.errors = [];
                    if(config.debugMode) console.log(dtoMuster);
                    if (JSON.stringify(dtoMuster) === JSON.stringify({})) {
                        $scope.errors.push("No muster records altered");
                        return;
                    }
                    MusterService.SubmitMuster(dtoMuster,
                        function (response) {
                            $scope.messages.push("Muster successfully submitted. Please wait for updated muster to load before submitting more changes.");
                            loadMuster();
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    )
                };

                // Give our scope a way to sort
                $scope.setOrder = function (theKey) {
                    if ($scope.orderKey == theKey) {
                        $scope.orderKey = "-" + theKey;
                    } else {
                        $scope.orderKey = theKey;
                    }
                }
            }
        ])
    .controller('MusterArchiveController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {
                $scope.musterDate = new Date();
                $scope.musterDate.setDate($scope.musterDate.getDate() - 1);

                // Default sorting
                $scope.viewBy = "division";

                var getIndexByValue = function(list, name){
                    for(var i in list) {
                        if(list[i].Value == name){
                            return i;
                        }
                    }
                    return -1;
                };

                $scope.goToMuster = function (filters, fields, level) {
                        $location.path('/muster/archive/' + $scope.musterDate);
                };
                var getMuster = function (musterDate) {
                    $scope.errors = [];
                    $scope.dataLoading = true;
                    MusterService.LoadMusterByDay(musterDate,
                        function (response) {
                            $scope.dataLoading = false;
                            if(config.debugMode) console.log(response);
                            if (response.ReturnValue.length == 0) {
                                $scope.errors.push("No muster records for that date.");
                            } else {
                                $scope.showProgress = true;
                                $scope.fieldThing = {};
                                $scope.musterCounts = {
                                    "Present" : 0,
                                    "Terminal Leave" : 0,
                                    "Leave" : 0,
                                    "AA" : 0,
                                    "UA" : 0,
                                    "SIQ" : 0,
                                    "TAD" : 0,
                                    "Deployed" :0,
                                    "Total" : response.ReturnValue.length
                                };
                                $scope.command = {
                                    "name": response.ReturnValue[0].Command,
                                    "departments": [],
                                    "uics": []
                                };
                                for (var i in response.ReturnValue) {
                                    var record = response.ReturnValue[i];
                                    $scope.musterCounts[record["MusterStatus"]] += 1;
                                    $scope.fieldThing[record["MusterStatus"]] = "thing";
                                    var depId = getIndexByValue($scope.command.departments, record.Department);
                                    if (depId == -1) {
                                        $scope.command.departments.push(
                                            {
                                                Value: record.Department,
                                                Divisions : []
                                            });
                                        depId = getIndexByValue($scope.command.departments, record.Department);
                                    }
                                    var divId = getIndexByValue($scope.command.departments[depId].Divisions, record.Division);
                                    if (divId == -1) {
                                        $scope.command.departments[depId].Divisions.push(
                                            {
                                                Value: record.Division,
                                                Sailors : []
                                            });
                                        divId = getIndexByValue($scope.command.departments[depId].Divisions, record.Division);
                                    }
                                    $scope.command.departments[depId].Divisions[divId].Sailors.push(record);
                                    if (!record.UIC) { record.UIC = "NONE";}
                                    if (!$scope.command.uics[record.UIC]) {
                                        $scope.command.uics[record.UIC] = [];
                                    }
                                    $scope.command.uics[record.UIC].push(record);

                                } console.log($scope.command);
                                console.log($scope.fieldThing);
                            }
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };

                if($routeParams.musterDate) {
                    $scope.musterDate = new Date($routeParams.musterDate.replace(/\"/g, ""));
                }
                getMuster($scope.musterDate);
            }
        ])
    .controller('FinalizeMusterController',
        ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'AuthorizationService', 'MusterService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, AuthenticationService, AuthorizationService, MusterService, ProfileService, ConnectionService, config) {
                $scope.errors = [];
                $scope.messages = [];
                $scope.finalizeMuster = function () {
                    $scope.dataLoading = true;
                    $scope.errors = [];
                    $scope.messages = [];

                    MusterService.FinalizeMuster(
                        function () {
                            $scope.dataLoading = false;
                            $scope.messages.push("Muster successfully finalized.");
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                }
            }
        ]).filter('yesNo', function() {
    return function(input) {
        return input ? 'Yes' : 'No';
    }
});
/*****************
 File division
*****************/
'use strict';
 
angular.module('Muster')
 
.factory('MusterService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
        
        service.LoadTodaysMuster = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadMusterablePersonsForToday', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        service.SubmitMuster = function (musterSubmissions, success, error) {
            return ConnectionService.RequestFromBackend('SubmitMuster', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'mustersubmissions': musterSubmissions }, success, error);
        };

        service.LoadMusterByDay = function (musterDate, success, error) {
            return ConnectionService.RequestFromBackend('LoadMusterRecordsByMusterDay', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'musterdate': musterDate }, success, error);
        };

        service.FinalizeMuster = function (success, error) {
            return ConnectionService.RequestFromBackend('FinalizeMuster', { 'authenticationtoken': AuthenticationService.GetAuthToken() }, success, error);
        };

        return service;
    }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Navigation')

.controller('NavController',
    ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'ProfileService', 'AuthorizationService', 'ConnectionService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, ProfileService, AuthorizationService, ConnectionService) {

        $scope.resetPIIBanner = function () {
            $rootScope.containsPII = false;
        };

        $scope.canCreatePerson = function () { return AuthorizationService.CanCreatePerson(); };
        $scope.canUseAdminTools = function () { return AuthorizationService.CanUseAdminTools(); };

        $scope.createNewPerson = function () {
            ProfileService.CreatePerson(
                function (response) {
                    $location.path('/profile/' + response.ReturnValue);
                    $scope.dataLoading = false;

                },
                // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };


        $scope.logout = function () {
            ConnectionService.AddLoginMessage("Succesfully logged out!");
            AuthenticationService.Logout(
                function (response) {
                    AuthenticationService.ClearCredentials();
                    $location.path('/login');

                },
			    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                function (response) {
                    ConnectionService.HandleServiceError(response, $scope, $location);
                }
            );
        };
        $scope.isMyProfileActive = function () {
            return $routeParams.id === AuthenticationService.GetCurrentUserID();
        };

        $scope.getMyProfileURL = function () {
            if (AuthenticationService.GetCurrentUserID()) {
                return '#/profile/' + AuthenticationService.GetCurrentUserID();
            } else {
                return null;
            }
        };

        $scope.canFinalizeMuster = function () {
            // Implement this properly.
            return true;
        };

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }]);
/*****************
 File division
*****************/
'use strict';

angular.module('Profiles')

    .controller('ProfileController',
        ['$scope', '$rootScope', '$location', '$routeParams', '$filter', 'AuthenticationService', 'ProfileService', 'ConnectionService', 'config',
            function ($scope, $rootScope, $location, $routeParams, $filter, AuthenticationService, ProfileService, ConnectionService, config) {
                
                /*
                 *   This function chain is a little hefty, so a preface is warranted.
                 *
                 *   This is how we actually load the profile.
                 *   In this explanation, I'm assuming success on all backend calls. If that's not the case, the error is displayed at
                 *   the top of the screen, and, depending on the error, we may be kicked back to the login screen.
                 *
                 *   First, we call LoadProfile. We take the response and apply all appropriate data to the scope, converting anything
                 *   that needs it. We create functions the scope can use to check to see if the user has permission to search, return,
                 *   or edit a field, making properly displaying of the data easier.
                 *
                 *   After that, in the .then() after LoadProfile, we call TakeLock. The .then() call works because we return the promise
                 *   from the http call all the way up to the controller. This allows the user to edit the profile, making sure that no
                 *   one else is at the moment. Successfully acquiring the lock enables saving.
                 *
                 *   At the same time as we request a lock, we also GetCommands. This gets the structure of all available commands, so
                 *   that we can properly prompt the user with the right divisions in departments in commands, e.g., if they select
                 *   10 department at NIOC GA, we know to show them 11, 12, and 13 divisions. We also use this information to fill in the command,
                 *   department, and division information in $scope.profileData, since the backend doesn't want to send it through JSON to avoid
                 *   dealing with excessive circular dependancies.
                 */
                $scope.loadProfile = function () {
                    $scope.dataLoading = true;
                    $scope.errors = [];

                    $scope.getByName = function (theThings, thingName) {
                        if (theThings) {
                            for (var i = 0, len = theThings.length; i < len; i++) {
                                if (theThings[i].Name === thingName)
                                    return theThings[i]; // Return as soon as the object is found
                            }
                        }
                        return null; // The object was not found
                    };

                    $scope.getById = function (theThings, thingId) {
                        if (theThings) {
                            for (var i = 0, len = theThings.length; i < len; i++) {
                                if (theThings[i].Id === thingId)
                                    return theThings[i]; // Return as soon as the object is found
                            }
                        }
                        return null; // The object was not found
                    };

                    ProfileService.LoadProfile($routeParams.id,
                        function (response) {

                            // Set all the scope variables that matter the most.
                            $rootScope.containsPII = true;
                            $scope.dataLoading = false;
                            $scope.friendlyName = response.ReturnValue.FriendlyName;
                            $scope.profileData = response.ReturnValue.Person;
                            $scope.isMyProfile = response.ReturnValue.IsMyProfile;
                            $scope.returnableFields = response.ReturnValue.ResolvedPermissions.ReturnableFields.Main.Person;
                            $scope.editableFields = response.ReturnValue.ResolvedPermissions.EditableFields.Main.Person;

                            // Set up all the dates to be actual Dates
                            if(response.ReturnValue.Person.DateOfBirth) $scope.profileData.DateOfBirth = new Date(response.ReturnValue.Person.DateOfBirth);
                            console.log(response.ReturnValue.Person.DateOfBirth);
                            if(response.ReturnValue.Person.DateOfArrival) $scope.profileData.DateOfArrival = new Date(response.ReturnValue.Person.DateOfArrival);
                            if(response.ReturnValue.Person.DateOfDeparture) $scope.profileData.DateOfDeparture = new Date(response.ReturnValue.Person.DateOfDeparture);
                            if(response.ReturnValue.Person.EAOS) $scope.profileData.EAOS = new Date(response.ReturnValue.Person.EAOS);
                            if(response.ReturnValue.Person.PRD) $scope.profileData.PRD = new Date(response.ReturnValue.Person.PRD);
                            if(response.ReturnValue.Person.ClaimTime) $scope.profileData.ClaimTime = new Date(response.ReturnValue.Person.ClaimTime);


                            $scope.canSearchPersonField = function (field) {
                                return ('currentUser' in $scope.globals) && ($scope.globals.currentUser.permissions.searchable.indexOf(field) > -1);
                            };
                            $scope.canReturnPersonField = function (field) {
                                return $scope.returnableFields.indexOf(field) > -1;
                            };
                            $scope.canEditPersonField = function (field) {
                                return $scope.editableFields.indexOf(field) > -1;
                            }
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    ).then(function () {
                        // This is where LoadProfile ends, and the follow ups begin. We use .then above to make sure we don't try to take a
                        // lock on a profile that we haven't loaded, or try to process commands when we haven't loaded the profile's command.

                        ProfileService.TakeLock($routeParams.id,
                            // If we succeed, this is our callback.
                            function (response) {
                                // Hey, we have a lock. Sweet.
                                $scope.haveLock = true;

                                // Hey, let's save that lock. Sweet.
                                $scope.profileLock = response.ReturnValue;

                                $scope.$on('$locationChangeStart', function (event) {
                                    if ($scope.profileLock) {
                                        var lockId = $scope.profileLock.Id;
                                        $scope.profileLock = null;
                                        ProfileService.ReleaseLock(lockId, false, function (response) {
                                            return;
                                        }, function (response) {
                                            ConnectionService.HandleServiceError(response, $scope, $location);
                                        });
                                    }
                                });
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );

                        ProfileService.GetCommands(
                            // If we succeed, this is our callback
                            function (response) {
                                // Give our scope the commands and a function we can use to search inside them
                                $scope.commandList = response.ReturnValue.Command;

                                $scope.command = $scope.getById(response.ReturnValue.Command, $scope.profileData.Command);

                                // Fill in the objects where currently only Ids exist.
                                $scope.profileData.Command = $scope.command;
                                if($scope.profileData.Command) {
                                    $scope.profileData.Department = $scope.getById($scope.profileData.Command.Departments, $scope.profileData.Department);
                                    if ($scope.profileData.Department) {
                                        $scope.profileData.Division = $scope.getById($scope.profileData.Department.Divisions, $scope.profileData.Division);
                                    } else {
                                        $scope.profileData.Division = null;
                                    }
                                } else {
                                    $scope.profileData.Department = null;
                                }
                                if(config.debugMode) console.log($scope.form.$error);
                            },
                            // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                            function (response) {
                                ConnectionService.HandleServiceError(response, $scope, $location);
                            }
                        );
                    });
                };

                ProfileService.GetAllLists(
                    // If we succeed, this is our call back
                    function (response) {
                        $scope.lists = response.ReturnValue;
                        $scope.defaultPhoneType = $filter('filter')(response.ReturnValue.PhoneNumberType, { Value: "Home" })[0];

                    },
                    // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                    function (response) {
                        ConnectionService.HandleServiceError(response, $scope, $location);
                    }
                );

                /*ProfileService.GetPermissionGroups(
                 // If we succeed, this is our callback.
                 function (response) {
                 $scope.permissionGroups = response.ReturnValue;

                 },
                 // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                 function (response) {
                 ConnectionService.HandleServiceError(response, $scope, $location);
                 }
                 );*/
                $scope.loadProfile();

                $scope.loadFullAccountHistory = function () {
                    ProfileService.LoadAccountHistory($scope.profileData.Id,
                        // If we succeed, this is our call back
                        function (response) {
                            $scope.profileData.AccountHistory = response.ReturnValue;

                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );

                };

                $scope.updateProfile = function () {
                    $scope.dataLoading = true;
                    $scope.profileUpdateSuccess = false;
                    // Check to see if the Primary NEC is also one of the Secondary NECs. If it is, remove it.
                    for (var i in $scope.profileData.SecondaryNECs) {
                        if($scope.profileData.SecondaryNECs[i].Id == $scope.profileData.PrimaryNEC.Id){
                            $scope.profileData.SecondaryNECs.splice(i,1);
                        }
                    }

                    // Update the profile with the data currently on this page (used when "Save Profile" button is clicked)

                    ProfileService.UpdateMyProfile($scope.profileData,
                        // If we succeed, this is our callback
                        function (response) {
                            $scope.profileUpdateSuccess = true;
                            $scope.form.$setPristine();
                            $scope.loadProfile()
                        },
                        // If we fail, this is our call back. We use a convenience function in the ConnectionService.
                        function (response) {
                            ConnectionService.HandleServiceError(response, $scope, $location);
                        }
                    );
                };

                $scope.canDeleteEmail = function (email) {
                    if(email.substr(email.length-4)!='.mil') {return true;}

                    var c = 0;
                    for (var i in $scope.profileData.EmailAddresses){
                        if($scope.profileData.EmailAddresses[i].Address.substr($scope.profileData.EmailAddresses[i].Address.length-4) == '.mil') {
                            c += 1;
                        }
                    }

                    if(c != 1){
                        return true;
                    }
                    return false;
                };
                $scope.makePreferred = function (listOfItems, preferredOne) {
                    for (var i = 0; i < listOfItems.length; ++i) {
                        listOfItems[i].IsPreferred = false;
                    }
                    listOfItems[listOfItems.indexOf(preferredOne)].IsPreferred = true;
                    return listOfItems;
                };

                $scope.makeHome = function (listOfItems, home) {
                    for (var i = 0; i < listOfItems.length; ++i) {
                        listOfItems[i].IsHomeAddress = false;
                    }
                    listOfItems[listOfItems.indexOf(home)].IsHomeAddress = true;
                    return listOfItems;
                };

                $scope.isValidEmail = function (email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                };

                $scope.isValidPhoneNumber = function (number) {
                    var re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
                    return re.test(number);
                };

                $scope.isValidSSN = function (number) {
                    var re = /^\d{3}-?\d{2}-?\d{4}$/;
                    return re.test(number);
                };

                $scope.trimString = function (str) {
                    if (str) {
                        return str.replace(/^\s+|\s+$/g, '');
                    }
                    return '';
                };
            }]);
/*****************
 File division
*****************/
'use strict';
 
angular.module('Profiles')
 
.factory('ProfileService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};
		
        service.GetAllLists = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', {'enititynames': []}, success, error);
        };
        service.GetPermissionGroups = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadPermissionGroups', {}, success, error);
        };
		
        service.GetCommands = function (success, error) {
            return ConnectionService.RequestFromBackend('LoadReferenceLists', { 'acceptcachedresults': true, 'entitynames':['Command'] }, success, error);
        };

        service.UpdateMyProfile = function (person, success, error) {
            return ConnectionService.RequestFromBackend('UpdatePerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'person': person }, success, error);
		};

        service.CreatePerson = function (success, error) {
            return ConnectionService.RequestFromBackend('CreatePerson', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
        };

        service.TakeLock = function (personid, success, error) {
            return ConnectionService.RequestFromBackend('TakeProfileLock', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
        };

        service.ReleaseLock = function (profileLockId, force, success, error) {
            return ConnectionService.RequestFromBackend('ReleaseProfileLock', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'profilelockid': profileLockId, 'forcerelease' : force }, success, error);
        };

		service.LoadProfile = function (personid, success, error) {
		    return ConnectionService.RequestFromBackend('LoadPerson', {'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
		};

		service.LoadAccountHistory = function (personid, success, error) {
		    return ConnectionService.RequestFromBackend('LoadAccountHistoryByPerson', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'personid': personid }, success, error);
		};
		 
        return service;
    }]);
/*****************
 File division
*****************/
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
/*****************
 File division
*****************/
'use strict';
 
angular.module('Search')
 
.factory('SearchService',
    ['$http', '$localStorage', '$rootScope', '$timeout', 'AuthenticationService', 'ConnectionService',
    function ($http, $localStorage, $rootScope, $timeout, AuthenticationService, ConnectionService) {
        var service = {};

        service.GetFieldTypes = function (success, error) {
            return ConnectionService.RequestFromBackend('GetPersonMetaData', { 'authenticationtoken': AuthenticationService.GetAuthToken()}, success, error);
        };

        service.DoSimpleSearch = function (terms, showHidden, success, error) {
            return ConnectionService.RequestFromBackend('SimpleSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'searchterm': terms, 'showhidden': showHidden }, success, error);
        };
		
        service.DoAdvancedSearch = function (filters, returnFields, searchLevel, showHidden, success, error) {
            return ConnectionService.RequestFromBackend('AdvancedSearchPersons', { 'authenticationtoken': AuthenticationService.GetAuthToken(), 'filters': filters, 'returnfields': returnFields, 'searchLevel' : searchLevel, 'showhidden': showHidden }, success, error);
        };
		
        return service;
    }]);