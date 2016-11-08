
angular
  .module('genvox')
  .config(($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) => {
    cfpLoadingBarProvider.includeSpinner = false;

    $stateProvider
      .state('genvox', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'views/layout.html'
          },
          'navbar@genvox': {
            templateUrl: 'views/navbar.html',
            controller: 'NavbarController'
          },
          'footer@genvox': {
            templateUrl: 'views/footer.html'
          }
        }
      })
      .state('auth', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'views/auth.html'
          }
        }
      })
      .state('genvox.home', {
        url: '/home',
        authenticated: true,
        views: {
          'container@genvox': {
            templateUrl: 'views/home/home.html',
            controller: 'HomeController'
          }
        }
      })
      .state('genvox.profile', {
        url: '/profile',
        authenticated: true,
        views: {
          'container@genvox': {
            templateUrl: 'views/profile/profile.html',
            controller: 'ProfileController'
          }
        }
      })
      .state('auth.sign', {
        url: '/signin',
        authenticated: false,
        views: {
          'container@auth': {
            templateUrl: 'views/auth/auth.html',
            controller: 'AuthController'
          }
        }
      })
      .state('auth.fill', {
        url: '/fill',
        authenticated: true,
        views: {
          'container@auth': {
            templateUrl: 'views/auth/fill.html',
            controller: 'FillController'
          }
        }
      });


    $urlRouterProvider.otherwise(($injector) => {
      $injector.get('$state').go('genvox.home', {}, { reload: true, location: 'replace' });
    });

  })
  .run(($rootScope, $state, Auth) => {
    $rootScope.$on('$stateChangeStart', function(ev, toState) {

      Auth.authenticateIfPossible();

      if(toState.authenticated) {
        if(!Auth.isLoggedIn()) {
          $state.go('auth.sign', {}, {location: 'replace'});
          ev.preventDefault();
        } else if(Auth.missingData() && !(toState.name === 'auth.fill')) {
          $state.go('auth.fill', {}, {location: 'replace'});
          ev.preventDefault();
        }
      }
    });

  });
