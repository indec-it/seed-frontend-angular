
angular
  .module('genvox')
  .controller('ProfileController', function ($scope, $state, toastr, Auth, CurrentUser, Api) {
    $scope.state = $state;
    $scope.profile = CurrentUser.profile();
    $scope.user = CurrentUser.get();
    $scope.imageUrl = CurrentUser.image();
    $scope.canDeleteImage = () => _.isEmpty($scope.user.image);
    $scope.editingCity = false;
    $scope.editingPhone = false;
    $scope.editingEmail = false;
    $scope.editingName = false;
    $scope.toggle = (field) => $scope[`editing${field}`] = !$scope[`editing${field}`];

    $scope.update = (field) => {
      return Api
        .updateUser($scope.profile.user_id, $scope.user)
        .then((data) => Auth.setProfile(data))
        .then(() => toastr.success('Usuario actualizado'))
        .then(() => $scope.toggle(field))
        .catch(() => toastr.error('Error de red'))
    }
  });
