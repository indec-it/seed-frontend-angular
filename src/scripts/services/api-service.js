
angular
  .module('genvox')
  .service('Api', function ($http, CONFIG, Auth) {

    const API = `http://${CONFIG.genvox.url}`;

    const authenticated = (requestOptions = {}) => _.defaultsDeep(requestOptions, {
      headers: { Authorization: `Bearer ${Auth.token()}` }
    });


    // example api call
    this.getArtists = () => {
      return $http
        .get(`${API}/home/artists`)
        .then((res) => res.data)
    };

  });
