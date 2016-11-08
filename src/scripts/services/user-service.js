
angular
  .module('genvox')
  .service('CurrentUser', function ($state, $location, auth, store) {

    this.profile = () => {
      return store.get('profile');
    };

    this.get = () => {
      return this.profile().user_metadata;
    };

    this.image = () => {
      return this.get().image || this.profile().picture;
    }
  });
