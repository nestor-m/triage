var app = angular.module('app', [ 'ngGrid', 'checklist-model', 'ngCookies']);

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
		templateUrl : 'impresion_visual.html',
		controller : 'impresionVisualController'
	})
	
	.when('/impresion_visual', {
		templateUrl : 'impresion_visual.html',
		controller : 'impresionVisualController'
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

	.when('/prioridad1', {
		templateUrl : 'prioridad1.html',
		controller: 'prioridad1Controller'
	})
	
	.when('/prioridad2', {
		templateUrl : 'prioridad2.html',
		controller: 'prioridad2Controller'
	})
	
	.when('/prioridad3', {
		templateUrl : 'prioridad3.html',
		controller: 'prioridad3Controller'
	})
	
	.when('/lista_pacientes', {
		templateUrl : 'lista_pacientes.html',
		controller : 'personaController'
	})
	
	.when('/ingreso_form', {
		templateUrl : 'ingreso_form.html',
		controller : 'personaController'
	})
	
	.when('/paciente_ingresado', {
		templateUrl : 'paciente_ingresado.html',
		controller : 'pacienteIngresadoController'
	})
	
	.when('/signos_vitales', {
		templateUrl : 'signos_vitales.html',
		controller : 'signosVitalesController'
	})
	
	.when('/carga_sintomas', {
		templateUrl : 'carga_sintomas.html',
		controller : 'cargaSintomasController'
	});

});

/*****************************************************************************************/
//Este servicio no se usa, pero lo dejo para tenerlo de ejemplo. Se puede usar para pasar data entre controllers pero se pierde la info 
//al refrescar la pagina, por eso opte por $cookieStore
//Para usarlo en un controller hay que pasarlo por parametro, ej:
//app.controller('personaController', function($scope, $http,	$location, pacienteActualService){...});

/*app.service('pacienteActualService', function() {

	  this.setPaciente = function(unPaciente) {
		  this.paciente = unPaciente;
	  };
	  
	  this.getPaciente = function(){
	      return this.paciente;
	  };
	});*/

/*****************************************************************************************/

app.controller('personaController', function($scope, $http,	$location, $cookieStore) {

	
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
				$cookieStore.put('pacienteActual',data); //me guardo el paciente
				$location.path("/paciente_ingresado");
			})
			
		} else {
			$scope.ingreso_form.submitted = true;
			console.log($scope.ingreso_form.fechaNacFutura);
			console.log(fecNac);
		}
	}

	$scope.loadPersonas();

});

/**********************************************************************************************************/

app.controller('busquedaController',function($scope, $http, $location, $cookieStore) {

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

					$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
							$scope.pagingOptions.currentPage);

					$scope.botonIngresar = '<button type="button" class="btn btn-primary btn-xs" ng-click="ingresarPaciente(row)" name="botonSeleccionarPaciente">Ingresar</button>'
						
					$scope.ingresarPaciente = function(row){						
						$http.post("paciente/cargarPaciente",row.entity)
						  .success(function(data){//envia todos los datos de la persona (row.entity) pero con el id alcanza 
							$cookieStore.put('pacienteActual',data); //me guardo el paciente
							$location.path("/paciente_ingresado");
						});
						
				   };

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
							cellTemplate : $scope.botonIngresar,
							width : 70
						} ]
					};

				});


/**********************************************************************************************************/

app.controller('impresionVisualController', function($scope, $http, $location, $cookieStore) {
	
	$scope.pacienteActual = $cookieStore.get('pacienteActual');

	$scope.sintomas = [];
	$scope.loadSintomas = function() {
		
		$http.get("sintoma/ajaxListVisuales").success(function(data) {
			$scope.sintomas = data;
		});
	};
	
	$scope.paciente = {
			sintomas: []
	}
	
	$scope.cargarImpresionInicial = function() {
		$http.post("paciente/cargarSintomas", {
			id : $scope.pacienteActual.id,
			sintomas: $scope.paciente.sintomas
		}).success(function(data) {
			//en data viene el paciente
			if (data.prioridad != null && data.prioridad == "UNO"){
				console.log(data);
				$cookieStore.put('datosPaciente',data);
				$location.path("/prioridad1");
			}		
			else {
				//sigo con la carga
				$location.path("/carga_sintomas");
			}
		});
	};

	$scope.loadSintomas();
});

/**********************************************************************************************************/

app.controller('cargaSintomasController',function($scope, $http, $location, $cookieStore) {
	
	$scope.pacienteActual = $cookieStore.get('pacienteActual');
	
	$scope.sintomas = [];
	
	$scope.borrarSintoma = function (sintoma){
		var i = $scope.sintomas.indexOf(sintoma);
		if (i > -1) {
			$scope.sintomas.splice(i, 1);
		}		
	};

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
			$http.post('sintoma/traerSintomas', {
				sintoma : $scope.sintoma,
				tipoDeSintoma : $scope.tipoDeSintoma,
			}).success(function(data) {
				$scope.setPagingData(data, page, pageSize);
			})

		}, 100);
	};

	$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
			$scope.pagingOptions.currentPage);

	$scope.botonAgregar = '<button type="button" class="btn btn-primary btn-xs" ng-click="agregarSintoma(row)" name="botonAgregarSintoma">Agregar</button>'
		
	$scope.agregarSintoma = function(row){
		var repetido = false;
		for(var i=0;i<$scope.sintomas.length;i++){
			if($scope.sintomas[i].id == row.entity.id){
				repetido = true;
				break;
			}
		}
		if(!repetido){
			$scope.sintomas.push(row.entity);
		}
    };

	$scope.filtrarListadoDeSintomas = function() {
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
			displayName : 'Sintoma'
		}, {
			field : 'tipoDeSintoma',
			displayName : 'Tipo de sintoma'
		}, {
			cellTemplate : $scope.botonAgregar,
			width : 70
		} ]
	};
	
	$scope.enviarSintomas = function(){
		$http.post('paciente/cargarSintomas',{
			id: $scope.pacienteActual.id,
			sintomas: $scope.sintomas
		}).success(function(data){
			if (data.prioridad != null && data.prioridad == "UNO"){
				$cookieStore.put('datosPaciente',data);
				$location.path("/prioridad1");
			}else{
				alert('NO ES PRIORIDAD UNO =)');
			}		
		});		
	};
});
/*********************************************************************************************/
app.controller('pacienteIngresadoController', function($scope, $cookieStore) {
	$scope.pacienteActual = $cookieStore.get('pacienteActual');
});
/*********************************************************************************************/
app.controller('prioridad1Controller', function($scope, $location, $cookieStore){
	$scope.paciente = $cookieStore.get('datosPaciente');	
});

/*********************************************************************************************/
app.controller('prioridad2Controller', function($scope, $location, $cookieStore){
	$scope.paciente = $cookieStore.get('datosPaciente');	
});

/*********************************************************************************************/
app.controller('prioridad3Controller', function($scope, $location, $cookieStore){
	$scope.paciente = $cookieStore.get('datosPaciente');	
});




/*********************************************************************************************/
app.controller('signosVitalesController', function($scope, $http, $location, $cookieStore) {
	
	$scope.pacienteActual = $cookieStore.get('pacienteActual');
	
	
	$scope.cargarSignosVitales = function() {
			
			$http.post("paciente/cargarSignosVitales", {
				id : $scope.pacienteActual.id,
				presionArterial : $scope.presion,
				pulso : $scope.pulso,
				frecuenciaRespiratoria : $scope.frecuencia,
				temperatura : $scope.temperatura
			}).success(function(data) {
				if (data.prioridad != null && data.prioridad == "UNO"){
					$cookieStore.put('datosPaciente',data);
					$location.path("/prioridad1");
				}else{
					$location.path("/paciente_ingresado");
				}
			})
		
	}
	
});






