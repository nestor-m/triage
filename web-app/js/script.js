var app = angular.module('triageApp', ['ngGrid']);

	app.config(function($routeProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'inicio.html'
			})
			
			.when('/busqueda', {
				templateUrl : 'busqueda_paciente.html'
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
	

	app.controller('personaController', function($scope, $routeParams, $http, $location) {

	
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
        		alert("La fecha no puede ser futura","Error de validación");
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
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller('busquedaControllerrrrrrrrrrrrrrrr', function($scope) {
	    $scope.myData = [{nombre: "Moroni", DNI: 123456, nacimiento: "21/03/1987", direccion: "Calle 146 nro 3025"},
	                     {nombre: "Tiancum", DNI: 123456, nacimiento: "21/03/1987", direccion: "Calle 146 nro 3025"},
	                     {nombre: "Jacob", DNI: 123456, nacimiento: "21/03/1987", direccion: "Calle 146 nro 3025"}]
	    $scope.ingresarPersona = '<button id="editBtn" type="button" class="btn btn-primary" ng-click="edit(row)" >Ingresar</button> '
	    $scope.gridOptions = { data: 'myData',
	    columnDefs: [{field:'nombre', displayName:'Nombre'}, {field:'DNI', displayName:'DNI'}, {field:'nacimiento', displayName:'Fecha de nacimiento'},
	                 {field:'direccion', displayName:'Direccion'},{cellTemplate:$scope.ingresarPersona}]};
	});
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller('busquedaController', function($scope, $http) {
		
	    $scope.filterOptions = {
	        filterText: "",
	        useExternalFilter: true
	    }; 
	    $scope.totalServerItems = 0;
	    $scope.pagingOptions = {
	        pageSizes: [2, 5, 10],
	        pageSize: 2,
	        currentPage: 1
	    };	
	    $scope.setPagingData = function(data, page, pageSize){	
	        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
	        $scope.myData = pagedData;
	        $scope.totalServerItems = data.length;
	        if (!$scope.$$phase) {
	            $scope.$apply();
	        }
	    };
	    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
	        setTimeout(function () {
	            var data;
	            if (searchText) {
	                var ft = searchText.toLowerCase();
	                $http.get('persona/ajaxList').success(function (largeLoad) {		
	                    data = largeLoad.filter(function(item) {
	                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
	                    });
	                    $scope.setPagingData(data,page,pageSize);
	                });            
	            } else {
	                $http.get('persona/ajaxList').success(function (largeLoad) {
	                    $scope.setPagingData(largeLoad,page,pageSize);
	                });
	            }
	        }, 100);
	    };
		
	    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		
	    $scope.$watch('pagingOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
	          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	        }
	    }, true);
	    $scope.$watch('filterOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal) {
	          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	        }
	    }, true);
	    
	    $scope.ingresarPersona = '<button id="editBtn" type="button" class="btn btn-primary" ng-click="edit(row)" >Ingresar</button> '
		
	    $scope.gridOptions = {
	        data: 'myData',
	        enablePaging: true,
			showFooter: true,
	        totalServerItems: 'totalServerItems',
	        pagingOptions: $scope.pagingOptions,
	        filterOptions: $scope.filterOptions,
		    columnDefs: [{field:'id',visible:false},{field:'nombre', displayName:'Nombre'}, {field:'dni', displayName:'DNI'}, {field:'fechaDeNacimiento', displayName:'Fecha de nacimiento'},
		                 {field:'direccion', displayName:'Direccion'},{cellTemplate:$scope.ingresarPersona}]
	    };
	    
		$scope.buscarPersona = function () {
			alert($scope.dnib);
			alert($scope.nombreb);
			alert($scope.apellidob);
			alert($scope.fechaDeNacimientob);
			
	        setTimeout(function () {
	            var data;
	            if (searchText) {
	                var ft = searchText.toLowerCase();
	                $http.get('persona/ajaxList').success(function (largeLoad) {		
	                    data = largeLoad.filter(function(item) {
	                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
	                    });
	                    $scope.setPagingData(data,page,pageSize);
	                });            
	            } else {
	                $http.get('persona/ajaxList').success(function (largeLoad) {
	                    $scope.setPagingData(largeLoad,page,pageSize);
	                });
	            }
	        }, 100);
			
			
			//$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,'111111');
	    };
	    
	});

	
