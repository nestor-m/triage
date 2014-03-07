var app = angular.module('triageApp', [ 'ngGrid' ]);

app.config(function($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl : 'inicio.html'
	})

	.when('/busqueda', {
		templateUrl : 'busqueda_paciente.html',
		controller : 'busquedaController'
	})

	.when('/datos_maestros', {
		templateUrl : 'inicio.html'
	})

	.when('/reportes', {
		templateUrl : 'lista_pacientes.html',
		controller : 'personaController'
	})

	.when('/paciente_ingreso_previo_adultos', {
		templateUrl : 'paciente_ingreso_previo_adultos.html'
	})

	.when('/paciente_ingreso_previo_pediatricos', {
		templateUrl : 'paciente_ingreso_previo_pediatricos.html'
	})

	.when('/lista_pacientes', {
		templateUrl : 'lista_pacientes.html',
		controller : 'personaController'
	}).when('/ingreso_form', {
		templateUrl : 'ingreso_form.html',
		controller : 'personaController'
	});

});

app.controller('personaController', function($scope, $routeParams, $http,
		$location) {

	// $scope.ingreso_form.submitted = false;
	// $scope.ingreso_form.fechaNacFutura = false;
	$scope.personas = [];
	$scope.loadPersonas = function() {

		$http.get("persona/ajaxList").success(function(data) {
			$scope.personas = data
		})
	}

	$scope.addPersona = function() {
		var fecNac = new Date($scope.fechaDeNacimiento);
		var hoy = new Date();
		if (fecNac > hoy) {
			$scope.ingreso_form.fechaNacFutura = true;
		} else {
			$scope.ingreso_form.fechaNacFutura = false;
		}

		if ($scope.ingreso_form.$valid && !$scope.ingreso_form.fechaNacFutura) {
			$http.post("persona/ajaxSave", {
				nombre : $scope.nombre,
				apellido : $scope.apellido,
				fechaDeNacimiento : $scope.fechaDeNacimiento,
				dni : $scope.dni,
				direccion : $scope.direccion,
				telefono : $scope.telefono,
				obraSocial : $scope.obraSocial,
				nroAfiliado : $scope.nroAfiliado
			}).success(function(data) {
				//data.id //para obtener el id del paciente creado
			})
			$location.path("/");
		} else {
			$scope.ingreso_form.submitted = true;
			console.log($scope.ingreso_form.fechaNacFutura);
			console.log(fecNac);
		}
	}

	$scope.loadPersonas();

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app
		.controller(
				'busquedaController',
				function($scope, $http) {

					$scope.totalServerItems = 0;

					$scope.pagingOptions = {
						pageSizes : [ 10, 20, 30 ],
						pageSize : 10,
						currentPage : 1
					};

					$scope.setPagingData = function(data, page, pageSize) {
						var pagedData = data.slice((page - 1) * pageSize, page
								* pageSize);
						$scope.myData = pagedData;
						$scope.totalServerItems = data.length;
						if (!$scope.$$phase) {
							$scope.$apply();
						}
					};
					
					$scope.getPagedDataAsync = function(pageSize, page) {
						setTimeout(function() {
							$http.post('persona/ajaxBuscar', {
								nombre : $scope.nombre,
								apellido : $scope.apellido,
								fechaDeNacimiento : $scope.fechaDeNacimiento,
								dni : $scope.dni
							}).success(function(data) {
								$scope.setPagingData(data, page, pageSize);
							})

						}, 100);
					};
					
//					$scope.getPagedDataAsync = function(pageSize, page) {
//						$http.post('sintoma/cargarImpresionInicial',[{nombre:'nestor'},{nombre:'gabriel'},{nombre:'muñoz'}]);
//						
//					};

					$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
							$scope.pagingOptions.currentPage);

					$scope.botonIngresar = '<button type="button" class="btn btn-primary btn-xs" ng-click="ingresarPaciente(row)" name="botonSeleccionarPaciente">Ingresar</button>'
					$scope.ingresarPaciente = function(row){
						alert("Se ingreso al paciente " + row.entity.nombre + " " + row.entity.apellido 
								+ "\nDNI: " + row.entity.dni 
								+ "\nFecha de nacimiento: " + new Date(row.entity.fechaDeNacimiento).toDateString());
						
						$http.post("paciente/cargarPaciente",row.entity).success(function(data){//envia todos los datos de la persona (row.entity) pero con el id alcanza 
							//data //JSON del nuevo paciente creado
						});
					}

					$scope.buscarPersona = function() {
						$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
								$scope.pagingOptions.currentPage);
					};
					
				    $scope.$watch('pagingOptions', function (newVal, oldVal) {
				        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
				          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
				        }
				    }, true);

					$scope.gridOptions = {
						data : 'myData',
						enablePaging : true,
						showFooter : true,
						enableColumnResize : true,
						totalServerItems : 'totalServerItems',
						pagingOptions : $scope.pagingOptions,
						columnDefs : [ {
							field : 'id',
							visible : false
						}, {
							field : 'nombre',
							displayName : 'Nombre'
						}, {
							field : 'apellido',
							displayName : 'Apellido'
						}, {
							field : 'dni',
							displayName : 'DNI'
						}, {
							field : 'fechaDeNacimiento',
							displayName : 'Fecha de nacimiento',
							cellFilter : 'date:\'dd/MM/yyyy\'',
							width : 160
						}, {
							field : 'direccion',
							displayName : 'Dirección',
							width : 170
						}, {
							cellTemplate : $scope.botonIngresar
						} ]
					};

				});


////////////////////////////////////////////////////////////////////////////////////////////

app.controller('impresionVisualController', function($scope, $routeParams, $http,
		$location) {

	
	$scope.sintomas = [];
	$scope.loadSintomas = function() {

		$http.get("sintoma/ajaxListVisuales").success(function(data) {
			$scope.sintomas = data
		})
	}

	
	$scope.loadSintomas();

});
