
angular
  .module('genvox')
  .service('Validator', function () {

    this.minPassword = () => {
      return 6;
    };

    this.minName = () => {
      return 3;
    };

    this.maxName = () => {
      return 50;
    };

    this.passwordPattern = () => {
      return '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/';
    };

    this.modelOptions = () => {
      return {updateOn: 'blur'};
    };
  });



