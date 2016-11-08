angular
  .module('genvox')
  .service('Modal', function ($uibModal) {

    // example modal
    this.calification = (product, item) => $uibModal.open({
      templateUrl: 'views/modals/calification.html',
      controller: 'CalificationController',
      resolve: {
        product: () => product,
        item: () => item
      }
    });

  });
