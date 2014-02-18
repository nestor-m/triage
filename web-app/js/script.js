var triageApp = angular.module('triageApp', ['ngRoute']);

	triageApp.config(function($routeProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'inicio.html'
			})
			
			.when('/datos_maestros', {
				templateUrl : 'inicio.html'
			})
			
			.when('/reportes', {
				templateUrl : 'lista_pacientes.html',
				controller  : 'personaController'
			})

			.when('/paciente_ingreso_previo_adultos', {
				templateUrl : 'paciente_ingreso_previo_adultos.html'
			})

			.when('/paciente_ingreso_previo_pediatricos', {
				templateUrl : 'paciente_ingreso_previo_pediatricos.html'
			})
			
			.when('/lista_pacientes', {
				templateUrl : 'lista_pacientes.html',
				controller  : 'personaController'
			})
			.when('/ingreso_form', {
				templateUrl : 'ingreso_form.html',
				controller  : 'personaController'
			});
		
	});

	triageApp.controller('personaController', function($scope, $routeParams, $http) {

	
	  $scope.personas = [];
	  $scope.loadPersonas = function() {
	        $http.get("persona/ajaxList").success( function( data ) {
	            $scope.personas = data
	        })
	    }
	    $scope.addPersona = function() {
//	    	if ($scope.nombre == null){
//        		alert("El campo nombre es obligatorio");
//        		return false;
//        	}
//        	if ($scope.apellido == null){
//        		alert("El campo apellido es obligatorio");
//        		return false;
//        	} 
//        	if ($scope.fechaDeNacimiento == null){
//        		alert("El campo fecha de nacimiento es obligatorio");
//        		return false;
//        	}
        	
	    	
	        $http.post(
	            "persona/ajaxSave",
	            {
	                nombre : $scope.nombre,
	                apellido : $scope.apellido,
	                fechaDeNacimiento : $scope.fechaDeNacimiento,
	                dni : $scope.dni,
	                direccion : $scope.direccion,
	                telefono : $scope.telefono,
	                obraSocial : $scope.obraSocial,
	                nroAfiliado : $scope.nroAfiliado
	            }
	        )
	        .success( function( data ) {
	            $scope.personas = data;
	            $scope.nombre = "";
	            $scope.apellido = "";
	            $scope.fechaDeNacimiento = "";
	            $scope.dni = 0;
	            $scope.direccion = "";
	            $scope.telefono = 0;
	            $scope.obraSocial = "";
	            $scope.nroAfiliado = "";
	        	})
	        	
	       
	    }
	    $scope.loadPersonas()
	   
	});
	
