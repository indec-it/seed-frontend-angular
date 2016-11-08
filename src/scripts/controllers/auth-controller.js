
angular
  .module('genvox')
  .controller('AuthController', ($scope, $state, auth, Auth, Validator) => {
    $scope.user = {
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: ''
    };

    const userMetadata = () => _.omit($scope.user, ['username', 'password', 'confirmPassword']);

    $scope.state = $state;
    $scope.Validator = Validator;
    $scope.currentTab = 'signin';
    $scope.isActual = (tab) => $scope.currentTab === tab;
    $scope.go = (tab) => {$scope.currentTab = tab;}
    $scope.signin = (username, password) => Auth.signin(username, password);
    $scope.facebookSignin = () => Auth.facebookSignin();
    $scope.signup = (isValid) => {
      !isValid
        ? Promise.resolve()
        : Auth.emailSignup($scope.user.username, $scope.user.password, userMetadata());
    }
  });
