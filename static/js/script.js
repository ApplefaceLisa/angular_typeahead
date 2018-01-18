var typeAhead = angular.module('TypeAheadApp', []);

typeAhead.controller('TypeAheadController',function($scope, dataFactory){
    $scope.user = {
        id : null,
        name : "",
        company : "",
        email : "",
        template : "",
        title : ""
    };

    $scope.incomplete = true;
    $scope.$watch("user.name", function() { $scope.test(); });
    $scope.$watch("user.company", function() { $scope.test(); });
    $scope.$watch("user.title", function() { $scope.test(); });

    $scope.test = function() {
      $scope.incomplete = true;
      if ($scope.user.id && $scope.user.company && $scope.user.title) {
          $scope.incomplete = false;
      }
    };

    $scope.save = function($event) {
      $event.preventDefault();
      if ($scope.user.id) {
        let url = "/users/" + $scope.user.id;
        dataFactory.update(url, $scope.user);
      } /*
      else {
        dataFactory.add("/users", $scope.user);
      }
      */
      $scope.user = {
        id : null,
        name : "",
        company : "",
        email : "",
        template : "",
        title : ""
      };
    }
});

typeAhead.directive('typeahead', function($timeout, dataFactory) {
  return {
    restrict: 'AEC',
    scope: {
      model: '='
    },

    link : function(scope,elem,attrs){
      scope.users = [];
      scope.current = 0;
      scope.hide = true;

      scope.handleInput = function(name) {
        scope.model.id = null;
        scope.hide = true;
        if (name.length > 3) {
          dataFactory.search("/users", name)
          .then(function(res) {
            scope.users = res.data;
            scope.hide = (!scope.users.length);
          });
        }
      };

      scope.handleSelection = function(user){
        scope.model = user;
        scope.current = 0;
        scope.hide = true;
      };

      scope.isCurrent = function(index){
         return scope.current == index;
      };
      scope.setCurrent = function(index){
         scope.current = index;
      };
    },
    templateUrl: 'templates/templateurl.html'
  }
});

typeAhead.factory('dataFactory', function($http) {
  return {
    search: function(url, name) {
        console.log("factory search");
        return $http({
          url: url,
          method: "GET",
          params: { name : name }
        });
    },
    add: function(url, data) {
        return $http({
            method : "POST",
            url : url,
            data : data
        });
    },
    update: function(url, data) {
        return $http({
            method : "PUT",
            url : url,
            data : data
        });
    }
  };
});