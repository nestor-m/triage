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

	triageApp.controller('personaController', function($scope, $routeParams, $http, $location) {

	
	  $scope.personas = [];
	  $scope.loadPersonas = function() {
		  
	        $http.get("persona/ajaxList").success( function( data ) {
	            $scope.personas = data
	        })
	    }
	  
	    $scope.addPersona = function() {
	    	if ($scope.nombre == null || $scope.nombre == ''){//esto lo escribo para que pase el test de casper pero para la aplicacion no es necesario
        		alert("Nombre es un campo obligatorio"); 
        		return;
        	}
        	if ($scope.apellido == null || $scope.apellido == ''){
        		alert ("Apellido es un campo obligatorio");
        		return;
        	}
        	
        	if ($scope.fechaDeNacimiento == null || $scope.fechaDeNacimiento == ''){
        		alert ("Fecha de nacimiento es un campo obligatorio");
        		return;
        	}
	    	
	    	var fechaDeNacimiento = new Date($scope.fechaDeNacimiento);
	    	var hoy = new Date();
	    	
        	if (fechaDeNacimiento > hoy){//valido que la fecha de nacimiento no sea futura
        		alert("La fecha no puede ser futura");
        		return;
        	}
	    	
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
	        	})       

        	$location.path("/lista_pacientes");			    
	    }
	    
	    $scope.loadPersonas();
	   
	});
	
