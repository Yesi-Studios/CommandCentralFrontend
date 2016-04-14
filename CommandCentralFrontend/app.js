'use strict';

// declare modules
angular.module('Authentication', ['Authorization']);
angular.module('Home', ['Authentication', 'pdf']);
angular.module('AppStatus', ['Authentication']);
angular.module('Navigation', ['Authentication']);
angular.module('Profiles', ['Authentication', 'ui.bootstrap']);
angular.module('Authorization', ['Authentication']);
angular.module('Search', ['Authentication', 'Authorization']);

angular.module('CommandCentral', [
    'Authentication',
	'Authorization',
    'Home',
	'AppStatus',
	'Navigation',
	'Profiles',
	'Search',
    'ngRoute',
    'ngStorage',
	'ui.bootstrap',
	'pdf'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
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
		
		.when('/search/:searchTerms', {
            controller: 'SearchController',
            templateUrl: 'modules/search/views/search.html'
        })
		
		.when('/searchbyfield', {
            controller: 'SearchByFieldController',
            templateUrl: 'modules/search/views/searchbyfield.html'
        })
		
		.when('/searchbyfield/:searchTerms/:returnFields', {
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
		
		.when('/forgotpassword', {
			controller: 'ForgotController',
			templateUrl: 'modules/authentication/views/forgotpassword.html',
			hideMenus: true
		})
		
		.when('/finishreset/:id', {
			controller: 'FinishResetController',
			templateUrl: 'modules/authentication/views/finishreset.html',
			hideMenus: true
		})
 
        .otherwise({ redirectTo: '/' });
}])
 
.run(['$rootScope', '$location', '$localStorage', '$http', 'AuthenticationService',
    function ($rootScope, $location, $localStorage, $http, AuthenticationService) {
		// keep user logged in after page refresh
        $rootScope.globals = $localStorage.globals || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
		
		$rootScope.globals.loginMessages = [];
		$rootScope.globals.loginErrors = [];
		
		// whenever the location changes... 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
			// Show news and navigation when appropriate
			$rootScope.showNews = $location.path().indexOf('/register') == -1 && $location.path().indexOf('/finishregistration') == -1 && $location.path().indexOf('/forgotpassword') == -1 &&$location.path().indexOf('/finishreset') == -1;
			$rootScope.showNav = $location.path().indexOf('/login') == -1 && $location.path().indexOf('/register') == -1 && $location.path().indexOf('/finishregistration') == -1 && $location.path().indexOf('/forgotpassword') == -1 &&$location.path().indexOf('/finishreset') == -1;

            // redirect to login page if not logged in
            if ($location.path().indexOf('/login') == -1 && $location.path() !== '/resetlogin' && $location.path() !== '/register' && $location.path().indexOf('/finishregistration') == -1 && $location.path() !== '/forgotpassword' && $location.path().indexOf('/finishreset') == -1 && !$rootScope.globals.currentUser) {
                AuthenticationService.AddLoginError("You must log in to see that page");
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
                $div2 = element.find('.div2')

            // force our virtual scrollbar to work the way we want.
            $wrapper1.css({
                width: "100%",
                border: "none 0px rgba(0, 0, 0, 0)",
                overflowX: "scroll",
                overflowY: "hidden",
                height: "20px",
            });

            $div1.css({
                height: "20px",
            });

            $wrapper2.css({
                width: "100%",
                overflowX: "scroll",
            });

            listener = setInterval(function () {
                widthListener();
            }, 650);

            updateScroll();
        }
    }
}]);