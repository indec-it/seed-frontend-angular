
angular
  .module('genvox')
  .controller('FillController', ($scope, $state, auth, Auth, Validator, Api) => {
    $scope.user = Auth.user() || {};
    $scope.user.email = Auth.profile().email;
    $scope.user.firstName = Auth.profile().given_name;
    $scope.user.lastName = Auth.profile().family_name;

    $scope.state = $state;
    $scope.Validator = Validator;
    $scope.submit = (isValid) => {
      return !isValid
        ? Promise.resolve()
        : Api.updateUser(Auth.profile().user_id, $scope.user)
          .then((data) => Auth.setProfile(data))
          .then(() => $state.go('genvox.home'));
    }
  });
