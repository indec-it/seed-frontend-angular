
angular
  .module('genvox')
  .service('Auth', function ($state, $location, toastr, auth, store, jwtHelper) {

    this.setProfile = (profile) => {
      store.set('profile', profile);
    };

    const onLoginSuccess = (profile, token) => {
      this.setProfile(profile);
      store.set('token', token);
      $state.go('genvox.home');
    };

    const onLoginError = (error) => {
      toastr.error(error.name);
    };

    const authParams = { scope: 'openid name email'};

    this.signin = (username, password) => {
      return auth.signin({
        sso: false,
        username,
        password,
        connection: 'Username-Password-Authentication',
        authParams
      }, onLoginSuccess, onLoginError);
    };

    this.emailSignup = (username, password, data) => {
      return auth.signup({
        sso: false,
        username,
        password,
        user_metadata: data,
        connection: 'Username-Password-Authentication',
        authParams
      }, onLoginSuccess, onLoginError);
    };

    this.facebookSignin = () => {
      return auth.signin({
        popup: true,
        connection: 'facebook',
        authParams
      }, onLoginSuccess, onLoginError);
    };

    this.profile = () => {
      return store.get('profile');
    };

    this.user = () => {
      return this.profile().user_metadata;
    };

    this.token = () => {
      return store.get('token');
    };


    this.signout = () => {
      auth.signout();
      store.remove('token');
      store.remove('profile');
      $state.go('auth.sign');
    };

    this.missingData = () => {
      return _.isUndefined(this.user());
    };

    this.isLoggedIn = () => {
      return auth.isAuthenticated;
    };

    this.isTokenExpired = () => {
      return _.isEmpty(this.token()) || jwtHelper.isTokenExpired(this.token());
    };

    this.authenticate = () => {
      auth.authenticate(this.profile(), this.token());
    };

    this.authenticateIfPossible = () => {
      if(!this.isTokenExpired() && !this.isLoggedIn()) {
        this.authenticate();
      }
    }

  });
