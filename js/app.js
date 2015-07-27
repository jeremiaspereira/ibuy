  var app = angular.module('myapp', ['ui.router', 'ngAnimate']);

  var id = 3;
  var total = 0;
  var lista = this;

  lista.produtos = [
    {
      id: 1,
      produto:"Feijão",
      valor : "10",
      selecionado: false
    },
    {
      id: 2,
      produto:"Arroz", 
      valor: "5",
      selecionado : false
    }
  ];

  app.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $urlRouterProvider) {    
    $urlRouterProvider.otherwise("/erro-404");
    $stateProvider

    .state('login', {
      url: "",
      views: {
        "conteudo": { templateUrl: "pages/login.html" }
      }
    })
    .state('home', {
      url: "/home",
      views: {
        "menu": { templateUrl: "pages/header.html" },
        "conteudo": { templateUrl: "pages/home.html" }
      },
      controller: 'HomeController'
    })
    .state('detalhes', {
      url: "/detalhes",
      views: {
        "menu": { templateUrl: "pages/header.html" },
        "conteudo": { templateUrl: "pages/detalhes.html" }
      },
      controller: 'DetalhesController'
    })

    .state('erro-404', {
      url: "/erro-404",
      views: {
        "conteudo": { templateUrl: "pages/erro-404.html" }
      }
    });       
  }]);

  app.controller("HomeController", ['$scope','$animate', function ($scope, $animate) {
    $scope.lista = lista;
    $scope.total = 0;

    $scope.add = function(){
      if($scope.testeNumero(lista.addValor) && lista.addProduto != undefined){
        lista.produtos.push({produto: lista.addProduto, valor: lista.addValor.replace('.',','), id: $scope.getId(), selecionado: false});
        lista.addProduto = "";
        lista.addValor = "";
      }
    };

    $scope.remover = function(p){
      var listaAntiga = lista.produtos;
      lista.produtos = [];
      angular.forEach(listaAntiga, function(produto) {
        if (produto != p) lista.produtos.push(produto);
      });
      $scope.atualizarTotal();
    };

    $scope.edit = function(p){
      if(p != undefined){
        $scope.lista.editProduto = p.produto;
        $scope.lista.editValor = p.valor;
        $scope.lista.editId = p.id;

        var myEl = angular.element( document.querySelector( '#edit-'+p.id ) );
        myEl.prepend(document.querySelector('#formEdit'));
        $scope.customEdit = $scope.customEdit === false ? true : false;
      }else{
        if($scope.testeNumero(lista.editValor) && lista.editProduto != ""){
          var listaAntiga = lista.produtos;
          lista.produtos = [];
          angular.forEach(listaAntiga, function(produto) {
            if (produto.id == $scope.lista.editId){
              produto.produto = lista.editProduto;
              produto.valor = lista.editValor.replace('.',',');
              lista.produtos.push(produto);  
            }else{
              lista.produtos.push(produto);
            }
          });

          $scope.atualizarTotal();

          var myEl = angular.element( document.querySelector( '#edit-0' ) );
          myEl.prepend(document.querySelector('#formEdit'));
          $scope.customEdit = true;  
        }  
      }
    };

    $scope.select = function(p){
      var listaAntiga = lista.produtos;
      lista.produtos = [];
      angular.forEach(listaAntiga, function(produto) {
        if(produto.id == p.id){
          produto.selecionado = p.selecionado;
        }
        lista.produtos.push(produto);
      });
      $scope.atualizarTotal();
    };

    $scope.atualizarTotal = function(){
      if(lista.produtos.length > 0){
        total = 0;
        angular.forEach(lista.produtos, function(produto) {
          if(produto.selecionado == true){
            //var valor = produto.valor;
            total = total + parseFloat(produto.valor.replace(',', '.'));
          }
        });
      }
      $scope.total = total;
    };

    $scope.customAdd = true;
    $scope.customEdit = true;
    $scope.toggleCustom = function () {
      $scope.customAdd = $scope.customAdd === false ? true : false;
    };

    $scope.getId = function () {
     return id++;
    };

    $scope.testeNumero = function(n) {
      n = n.replace(',','.');
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
  }]);

  app.controller("DetalhesController", ['$scope', function ($scope) {
    $scope.lista = lista;
    $scope.total = total;
  }]);


