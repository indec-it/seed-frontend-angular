
angular
  .module('genvox')
  .controller('CalificationController', ($scope, $uibModalInstance, toastr, product, item, Api) => {
    $scope.item = item;
    $scope.product = product;
    $scope.validCalification = () => _.includes([1,2,3,4,5], $scope.item.calification);
    $scope.doSubmit = () => {
      return Api
        .calificate({id: $scope.item.id, calification: $scope.item.calification})
        .then(() => toastr.success('Calificado correctamente'))
        .then(() => $uibModalInstance.close());
    };
    $scope.submit = () => {
      return $scope.validCalification() ? $scope.doSubmit() : toastr.error('Debe elegir una calificacion');
    }
  });
