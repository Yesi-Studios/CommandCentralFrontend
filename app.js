'use strict';

// declare modules
angular.module('Connection', []);
angular.module('FAQ', ['Connection', 'Authentication', 'Authorization']);
angular.module('Feedback', ['Connection', 'Authentication', 'Authorization']);
angular.module('Authentication', ['Authorization', 'angularModalService', 'Modals', 'Profiles', 'Connection']);
angular.module('Authorization', ['Authentication', 'Connection']);
angular.module('Navigation', ['Authentication', 'Profiles', 'Authorization']);
angular.module('Profiles', ['Authentication', 'ui.bootstrap', 'ui.mask', 'Connection']);
angular.module('Home', ['Authentication', 'Authorization', 'Connection']);
angular.module('Administration', ['Authentication', 'Connection']);
angular.module('Search', ['Authentication', 'Authorization', 'Connection', 'ui.bootstrap']);
angular.module('Muster', ['Authentication', 'Authorization', 'Profiles', 'Connection']);
angular.module('Watchbill', ['Authentication', 'Authorization', 'Profiles', 'Connection']);

angular.module('Modals', ['angularModalService']);

angular.module('CommandCentral', [
    'Administration',
    'Authentication',
	'Authorization',
    'Connection',
    'FAQ',
    'Feedback',
    'Home',
	'Navigation',
	'Profiles',
	'Search',
    'Modals',
    'Muster',
    'Watchbill',
    'angularModalService',
    'ngRoute',
    'ngStorage',
	'ui.bootstrap',
    'ui.mask'
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

        .when('/feedback', {
            controller: 'FeedbackController',
            templateUrl: 'modules/feedback/views/feedback.html'
        })

        .when('/faq', {
            controller: 'FAQController',
            templateUrl: 'modules/faq/views/faq.html'
        })

        .when('/createnews', {
            controller: 'CreateNewsController',
            templateUrl: 'modules/home/views/createnews.html'
        })

        .when('/faq/create', {
            controller: 'CreateFAQController',
            templateUrl: 'modules/faq/views/createfaq.html'
        })

        .when('/faq/create/:id', {
            controller: 'CreateFAQController',
            templateUrl: 'modules/faq/views/createfaq.html'
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

        .when('/watchbill', {
            controller: 'WatchbillsController',
            templateUrl: 'modules/watchbill/views/watchbills.html'
        })

        .when('/watchbill/populate/:id', {
            controller: 'WatchbillPopulateController',
            templateUrl: 'modules/watchbill/views/watchbillpopulate.html'
        })

        .when('/watchbill/eligibility/', {
            controller: 'WatchbillEligibilityController',
            templateUrl: 'modules/watchbill/views/eligibilityeditor.html'
        })

        .when('/watchbill/:id', {
            controller: 'WatchbillController',
            templateUrl: 'modules/watchbill/views/watchbill.html'
        })

        .when('/watchbill/edit/:id', {
            controller: 'WatchbillEditorController',
            templateUrl: 'modules/watchbill/views/watchbilleditor.html'
        })

        .when('/watchbill/progress/:id', {
            controller: 'WatchbillProgressController',
            templateUrl: 'modules/watchbill/views/progress.html'
        })

        .when('/watchbill/input/:id', {
            controller: 'WatchbillInputController',
            templateUrl: 'modules/watchbill/views/input.html'
        })

        .when('/watchbill/swap/:id', {
            controller: 'WatchbillSwapController',
            templateUrl: 'modules/watchbill/views/swap.html'
        })

        .when('/watchbill/approve/:id', {
            controller: 'WatchbillApproveController',
            templateUrl: 'modules/watchbill/views/approve.html'
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

		.when('/searchbyfield/print/:searchTerms/:returnFields/:searchLevel/:showHidden', {
            controller: 'SearchByFieldPrintController',
            templateUrl: 'modules/search/views/searchbyfieldprint.html'
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

        // create Regex to match publicly accessible pages
        var publicPagesRegex = /(\/login|^\/resetlogin$|^\/register$|\/finishregistration|^\/forgotpassword$|^\/forgotusername$|\/finishreset)/;

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
			$rootScope.showNav = !$location.path().match(publicPagesRegex);

            // redirect to login page if not logged in
            if ( !$location.path().match(publicPagesRegex) && !$rootScope.globals.currentUser) {
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
        '<input ng-if="fieldType == \'Boolean\'" type="text" class="form-control" disabled>'+
        '<span class="input-group-addon" ng-if="fieldType == \'Boolean\'"><input type="checkbox" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName]"></span>'+
        '<input ng-if="fieldType == \'String\'" type="text" class="form-control" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName]">' +
        '<ng-custom-date-picker ng-if="fieldType == \'DateTime\'" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName][0][\'From\']"></ng-custom-date-picker> '+
        '<ng-custom-date-picker ng-if="fieldType == \'DateTime\'" aria-describedby="searchAddon{{fieldName}}" ng-model="ngModel[fieldName][0][\'To\']"></ng-custom-date-picker>'+
        '<input ng-if="fieldType != \'String\' && fieldType != \'DateTime\' && fieldType != \'Boolean\'" type="text" value="This field is not searchable" class="form-control" aria-describedby="searchAddon{{fieldName}}" disabled>'+
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