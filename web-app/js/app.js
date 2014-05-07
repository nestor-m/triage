var app = angular.module('app', [ 'ngRoute', 'ngGrid', 'checklist-model',
		'ngCookies', 'ngDropdowns' ]);

app.config(function($routeProvider) {
	$routeProvider

	/*
	 * .when('/', { templateUrl : 'inicio.html' })
	 */

	.when('/', {
		templateUrl : 'busqueda_ingreso_paciente.html',
		controller : 'busquedaController'
	})

	.when('/datos_maestros', {
		templateUrl : 'impresion_visual.html',
		controller : 'impresionVisualController'
	})

/*	.when('/impresion_visual', {
		templateUrl : 'impresion_visual.html',
		controller : 'impresionVisualController'
	})*/

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
		controller : 'prioridad1Controller'
	})

	.when('/prioridad2', {
		templateUrl : 'prioridad2.html',
		controller : 'prioridad2Controller'
	})

	.when('/prioridad3', {
		templateUrl : 'prioridad3.html',
		controller : 'prioridad3Controller'
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

	.when('/finalizar_paciente', {
		templateUrl : 'finalizar_paciente.html',
		controller : 'finalizarPacienteController'
	})
	
/*	.when('/signos_vitales', {
		templateUrl : 'signos_vitales.html',
		controller : 'signosVitalesController'
	})*/
	
	.when('/pacientes_espera', {
		templateUrl : 'pacientes_espera.html',
		controller : 'pacientesEsperaController'
	})

	/*.when('/carga_sintomas', {
		templateUrl : 'carga_sintomas.html',
		controller : 'cargaSintomasController'
	})*/;
});




/** ************************************************************************************** */
// Este servicio no se usa, pero lo dejo para tenerlo de ejemplo. Se puede usar
// para pasar data entre controllers pero se pierde la info
// al refrescar la pagina, por eso opte por $cookieStore
// Para usarlo en un controller hay que pasarlo por parametro, ej:
// app.controller('personaController', function($scope, $http, $location,
// pacienteActualService){...});
/*
 * app.service('pacienteActualService', function() {
 * 
 * this.setPaciente = function(unPaciente) { this.paciente = unPaciente; };
 * 
 * this.getPaciente = function(){ return this.paciente; }; });
 */

/** ************************************************************************************** */

app.controller('personaController', function($scope, $http) {

	$scope.personas = [];
	$scope.loadPersonas = function() {

		$http.get("persona/ajaxList").success(function(data) {
			$scope.personas = data
		})
	}

	$scope.loadPersonas();

});

/** ******************************************************************************************************* */

app
		.controller(
				'busquedaController',
				function($scope, $http, $location, $cookieStore/* ,$locale */) {

					// $locale.id = "es-ar";

					/* Busqueda de paciente */

					$scope.totalServerItems = 0;

					$scope.pagingOptions = {
						pageSizes : [ 3, 6, 9 ],
						pageSize : 3,
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

					$scope.botonIngresar = '<button type="button" class="btn btn-primary btn-xs" ng-click="ingresarPaciente(row)" name="botonSeleccionarPaciente">Ingresar</button>'

					$scope.ingresarPaciente = function(row) {
						$http.post("paciente/cargarPaciente", row.entity)
								.success(function(data) {// envia todos los
															// datos de la
															// persona
															// (row.entity) pero
															// con el id alcanza
									$cookieStore.put('pacienteActual', data); // me
																				// guardo
																				// el
																				// paciente
									$location.path("/paciente_ingresado");
								});

					};

					$scope.buscarPersona = function() {
						// este if es necesario por el ng-blur
						if ($scope.nombre != null && $scope.nombre != ""
								|| $scope.apellido != null
								&& $scope.apellido != ""
								|| $scope.fechaDeNacimiento != null
								&& $scope.fechaDeNacimiento != ""
								|| $scope.dni != null && $scope.dni != "") {
							$scope.getPagedDataAsync(
									$scope.pagingOptions.pageSize,
									$scope.pagingOptions.currentPage);
						}
					};

					$scope.$watch('pagingOptions', function(newVal, oldVal) {
						if (newVal !== oldVal
								&& newVal.currentPage !== oldVal.currentPage) {
							$scope.getPagedDataAsync(
									$scope.pagingOptions.pageSize,
									$scope.pagingOptions.currentPage);
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

					/* Alta de paciente */

					$scope.agregarPersona = function() {
						// request
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
							$cookieStore.put('pacienteActual', data); // me
																		// guardo
																		// el
																		// paciente
							$location.path("/paciente_ingresado");
						});
					};
				});

// Directiva para ponerle un tope al date input
app
		.directive(
				'fechaConMaximo',
				function() {
					var hoy = new Date();
					// si mes o dia < 10 le agrego un cero adelante para que el
					// max me lo tome bien
					var mes = hoy.getMonth() + 1;
					mes = mes < 10 ? '0' + mes : mes;
					var dia = hoy.getDate();
					dia = dia < 10 ? '0' + dia : dia;
					var fechaMaxima = hoy.getFullYear() + "-" + mes + "-" + dia;
					return {
						template : '<input type="date" name="fechaDeNacimiento" id="fechaDeNacimiento" class="form-control" ng-model="fechaDeNacimiento"'
								+ 'ng-blur="buscarPersona()" max="'
								+ fechaMaxima + '"/>'
					}
				});

/** ****************************************************************************************** */
app.controller('pacienteIngresadoController', function($scope, $cookieStore, $http, $location) {
	$scope.pacienteActual = $cookieStore.get('pacienteActual');

	$scope.salir = function(){
		$cookieStore.remove('pacienteActual');
		$scope.pacienteActual = null;
		$location.path("/");
	};

	$scope.finalizarTriage = function(){
		$http.post("paciente/calcularPrioridad",{
			id : $scope.pacienteActual.id
		}).success(function(data){
			bootbox.alert("Triage finalizado con éxito<br>" + "Paciente " +$scope.pacienteActual.nombre + " " +
				$scope.pacienteActual.apellido + "<br>" +
				"PRIORIDAD " + data.prioridad);
			//TODO: aca deberia comenzar a contar el tiempo de espera
			$scope.salir();
		});

	};

	/*IMPRESION VISUAL*/
	$scope.sintomasImpresionVisual = [];
	
	$scope.paciente = {
			sintomas : []
		};
	
	$scope.traerSintomasImpresionVisual = function() {
		$http.get("sintoma/ajaxListVisuales").success(function(data) {
			$scope.sintomasImpresionVisual = data;
		});	
		$http.post("paciente/getSintomasVisuales", {
			id : $scope.pacienteActual.id
		}).success(function(data) {
			$scope.paciente.sintomas = data;
		});
	};

	$scope.cargarImpresionInicial = function() {
		$http.post("paciente/cargarSintomas", {
			id : $scope.pacienteActual.id,
			sintomas : $scope.paciente.sintomas
		}).success(function(data) {
			// en data viene el paciente
			if (data.prioridad != null && data.prioridad == "UNO") {
				$cookieStore.put('datosPaciente', data);
				$location.path("/prioridad1");
			} else {
				bootbox.alert("Impresión visual cargada con éxito");
			}
		});
	};

	$scope.traerSintomasImpresionVisual();	
	
	$scope.esPrioridadUnoImpresionVisual = function(sintoma){
		var confirmar = function(){
			bootbox.confirm(
				"¿Está seguro que desea ingresar el síntoma?",
				function(confirma) {
					if (confirma) {
						$scope.cargarImpresionInicial();
					}
			});
		};

		if($scope.pacienteActual.esAdulto){//es adulto
			if (sintoma.prioridadAdulto.name == "UNO"){
				confirmar();
			}
		}else{//es pediatrico
			if (sintoma.prioridadPediatrico.name == "UNO"){
				confirmar();
			}
		}		
	};

	/*INGRESO DE SINTOMAS*/
	$scope.sintomas = [];

	$scope.borrarSintoma = function(sintoma) {
		var i = $scope.sintomas.indexOf(sintoma);
		if (i > -1) {
			$scope.sintomas.splice(i, 1);
		}
	};

	$scope.totalServerItems = 0;

	$scope.pagingOptions = {
		pageSizes : [ 3, 6, 9 ],
		pageSize : 3,
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
				tipoDeSintoma : $scope.discriminante,
				esAdulto: $scope.pacienteActual.esAdulto
			}).success(function(data) {
				$scope.setPagingData(data, page, pageSize);
			})

		}, 100);
	};

	$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
			$scope.pagingOptions.currentPage);

	$scope.botonAgregarSintoma = '<button type="button" class="btn btn-primary btn-xs" ng-click="agregarSintoma(row)" name="botonAgregarSintoma">Agregar</button>';
		
	$scope.agregarSintoma = function(row){
		// primero chequeo si es un sintoma de PRIORIDAD 1
		if(row.entity.prioridad == "UNO"){
			bootbox.confirm("¿Está seguro que desea ingresar el síntoma?<br>" + row.entity.nombre,function(confirma){
				if(confirma){
					$scope.sintomas.push(row.entity);
					$scope.enviarSintomas();
				}
			});
			return;
		}

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
			displayName : 'Discriminante'
		}, {
			cellTemplate : $scope.botonAgregarSintoma,
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
				bootbox.alert("Síntomas cargados con éxito");
			}		
		});		
	};

	/*INGRESO DE SIGNOS VITALES*/
	$scope.pulsos = [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130,
			140, 150 ];
	$scope.frecuencias = [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];
	$scope.temperaturas = [ 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41 ];
	$scope.sistoles = [ 1110, 1112, 117 ];
	$scope.diastoles = [ 1110, 1112, 117 ,118];
	
	$scope.recuperarSignosVitales = function(){
		$http.post("paciente/getSignosVitales", {
			id : $scope.pacienteActual.id
		}).success(function(data){
			$scope.pulso = data.pulso;
			$scope.temperatura = data.temperatura;
			$scope.sistole = data.sistole;
			$scope.diastole = data.diastole;
			$scope.frecuencia = data.frecuencia;
		})
	}
	
	$scope.recuperarSignosVitales();
	
	$scope.enviarSignosVitales = function() {

		$http.post("paciente/cargarSignosVitales", {
			id : $scope.pacienteActual.id,
			sistole : $scope.sistole,
			diastole : $scope.diastole,
			pulso : $scope.pulso,
			frecuenciaRespiratoria : $scope.frecuencia,
			temperatura : $scope.temperatura
		}).success(function(data) {
			if (data.prioridad != null && data.prioridad == "UNO") {
				$cookieStore.put('datosPaciente', data);
				$location.path("/prioridad1");
			} else {
				bootbox.alert("Signos vitales cargados con éxito");
			}
		})

	};

	$scope.esPrioridadUno = function(modelo,label) {
		if($scope.pacienteActual.esAdulto){
			$scope.chequearSignosVitalesAdulto(modelo,label)
		}else{//es pediatrico
			switch($scope.pacienteActual.categoriaPediatrico){
				case 'recienNacido':
  					$scope.chequearSignosVitalesRecienNacido(modelo,label)
  					break;
				case 'menorDe3Anios':
  					$scope.chequearSignosVitalesMenorDe3Anios(modelo,label)
  					break;
  				case 'mayorDe3Anios':
  					$scope.chequearSignosVitalesMayorDe3Anios(modelo,label)
			}
		}
	};

	$scope.chequearSignosVitalesAdulto = function(modelo,label){
		if (($scope.pulso != '' && ($scope.pulso < 40 || $scope.pulso > 150)) ||
				($scope.frecuencia != '' && ($scope.frecuencia < 12 || $scope.frecuencia > 30 )) ||
				($scope.temperatura != '' && ($scope.temperatura < 35 || $scope.temperatura > 40))){

			$scope.mostrarMensajeDeConfirmacion(modelo,label);
		}
	};

	$scope.chequearSignosVitalesRecienNacido = function(modelo,label){
		alert('chequearSignosVitalesRecienNacido');
	};

	$scope.chequearSignosVitalesMenorDe3Anios = function(modelo,label){
		alert('chequearSignosVitalesMenorDe3Anios');
	};

	$scope.chequearSignosVitalesMayorDe3Anios = function(modelo,label){
		alert('chequearSignosVitalesMayorDe3Anhios');
	};

	$scope.mostrarMensajeDeConfirmacion = function(modelo,label){
		bootbox.confirm("¿Está seguro que desea ingresar el siguiente valor? <br>" + label + ": " + $scope[modelo],
			function(confirma) {						
				if (confirma) {
					$scope.enviarSignosVitales();
				}else{
					$scope[modelo] = '';//vacio el campo
					$scope.$apply();//actualizo la vista
				}
			});	
	};
});

/** ****************************************************************************************** */
app.controller('prioridad1Controller',
		function($scope, $location, $cookieStore) {
			$scope.paciente = $cookieStore.get('datosPaciente');
		});

/** ****************************************************************************************** */
app.controller('prioridad2Controller',
		function($scope, $location, $cookieStore) {
			$scope.paciente = $cookieStore.get('datosPaciente');
		});





/** ****************************************************************************************** */
app.controller('prioridad3Controller',
		function($scope, $location, $cookieStore) {
			$scope.paciente = $cookieStore.get('datosPaciente');
		});



/** ****************************************************************************************** */
app.controller('pacientesEsperaController',
		function($scope, $location, $cookieStore, $http) {
	
	
		$scope.botonTriage = '<button type="button" class="btn btn-primary btn-xs" ng-click="ingresarPaciente(row)" name="botonSeleccionarPaciente">Triage</button>'
		$scope.botonFinalizar = '<button type="button" class="btn btn-primary btn-xs" ng-click="finalizarPaciente(row)" name="botonFinalizarPaciente">Finalizar</button>'
			
			
		$scope.totalServerItems = 0;

		
		$scope.ingresarPaciente = function(row) {
			$http.post("paciente/cargarPacienteEnEspera", row.entity)
					.success(function(data) {// envia todos los
												// datos de la
												// persona
												// (row.entity) pero
												// con el id alcanza
						$cookieStore.put('pacienteActual', data); // me
																	// guardo
																	// el
																	// paciente
						$location.path("/paciente_ingresado");
					});

		};
		
		$scope.finalizarPaciente = function(row){
			$http.post("paciente/cargarPacienteEnEspera", row.entity)
			.success(function(data) {// envia todos los
										// datos de la
										// persona
										// (row.entity) pero
										// con el id alcanza
				$cookieStore.put('pacienteActual', data); // me
															// guardo
															// el
															// paciente
				$location.path("/finalizar_paciente");
			});
		}
		
		
		$scope.pagingOptions = {
			pageSizes : [ 3, 6, 9 ],
			pageSize : 3,
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
				$http.post('paciente/ajaxBuscarNoFinalizados', {
					nombre : $scope.nombre,
					apellido : $scope.apellido
				}).success(function(data) {
					$scope.setPagingData(data, page, pageSize);
				})

			}, 100);
		};
	
		
		$scope.$watch('pagingOptions', function(newVal, oldVal) {
			if (newVal !== oldVal
					&& newVal.currentPage !== oldVal.currentPage) {
				$scope.getPagedDataAsync(
						$scope.pagingOptions.pageSize,
						$scope.pagingOptions.currentPage);
			}
		}, true);
		
		$scope.buscarPersona = function() {
			// este if es necesario por el ng-blur
			if ($scope.nombre != null && $scope.nombre != ""
				|| $scope.apellido != null
					&& $scope.apellido != ""
					|| $scope.fechaDeNacimiento != null
					&& $scope.fechaDeNacimiento != ""
					|| $scope.dni != null && $scope.dni != "") {
				$scope.getPagedDataAsync(
						$scope.pagingOptions.pageSize,
						$scope.pagingOptions.currentPage);
			}
		};
		
		
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
					field : 'edad',
					displayName : 'Edad',
					width : 160
				}, {
					field : 'demora',
					displayName : 'Espera',
					width : 160
				}, {
					field : 'prioridad',
					displayName : 'Prioridad',
					width : 160
				},  {
					cellTemplate : $scope.botonTriage,
					width : 70
				}
				, {
					cellTemplate : $scope.botonFinalizar,
					width : 70
				}]
			};
	
		});
/** ***************************** FINALIZAR PACIENTE ********************************************* */
app.controller('finalizarPacienteController',
		function($scope, $location, $cookieStore, $http) {
		
	$scope.paciente = $cookieStore.get('pacienteActual');
	
	$scope.ingresa = {
			"id" : "1",
			"value" : "Ingresa"
	};
	$scope.consultorio = {
			"id" : "2",
			"value" : "Consultorio externo"
	};
	$scope.retira = {
			"id" : "3",
			"value" : "Retira"
	};
	
	$scope.finalizarTriage = function(){
		$http.post("paciente/calcularPrioridad",{
			id : $scope.paciente.id
		}).success(function(data){
			$scope.prioridad = data.prioridad;
		});
	};
	$scope.finalizarTriage();
	
	$scope.finalizarAtencion = function(){
		bootbox.confirm("¿Está seguro que desea finalizar la atención del paciente?<br>",function(confirma){
			if(confirma){
//				$scope.enviarDatosFinalizacion();
				$http.post("paciente/finalizarPaciente",{
					tipoFin : $scope.opciones.id,
					id : $scope.paciente.id
				}).success(function(data){
					$location.path("/pacientes_espera");
				});
			}
		});
	};
	
//	$scope.enviarDatosFinalizacion = function(){
//		$http.post("paciente/finalizarPaciente",{
//			tipoFin : $scope.opciones.id,
//			id : $scope.paciente.id
//		}).success(function(data){
//			$location.path("/pacientes_espera");
//		});
//	};
	
});



/** *********************************************************************Ingreso de signos vitales

********************* */
/*app.controller('signosVitalesController', function($scope, $http, $location,
		$cookieStore) {

	$scope.pacienteActual = $cookieStore.get('pacienteActual');
	$scope.pulsos = [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130,
			140, 150 ];
	$scope.frecuencias = [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];
	$scope.temperaturas = [ 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41 ];
	$scope.presiones = [ 1110, 1112, 117 ];

	
	$scope.loadSignosVitales = function(){
		$http.post("paciente/getSignosVitales", {
			id : $scope.pacienteActual.id
		}).success(function(data){
			$scope.pulso = data.pulso;
			$scope.temperatura = data.temperatura;
			$scope.presion = data.presion;
			$scope.frecuencia = data.frecuencia;
		})
	}
	
	$scope.loadSignosVitales();
	
	$scope.cargarSignosVitales = function() {

		$http.post("paciente/cargarSignosVitales", {
			id : $scope.pacienteActual.id,
			presionArterial : $scope.presion,
			pulso : $scope.pulso,
			frecuenciaRespiratoria : $scope.frecuencia,
			temperatura : $scope.temperatura
		}).success(function(data) {
			if (data.prioridad != null && data.prioridad == "UNO") {
				$cookieStore.put('datosPaciente', data);
				$location.path("/prioridad1");
			} else {
				$location.path("/paciente_ingresado");
			}
		})

	};

	$scope.esPrioridadUno = function() {

		if (($scope.pulso != null && ($scope.pulso < 40 || $scope.pulso > 150)) ||
				($scope.frecuencia != null && ($scope.frecuencia < 12 || $scope.frecuencia > 30 )) ||
				($scope.temperatura != null && ($scope.temperatura < 35 || $scope.temperatura > 40))){
				bootbox.confirm(
					"¿Está seguro que desea ingresar el síntoma?",
					function(confirma) {
						if (confirma) {
							$scope.cargarSignosVitales();
						}
				})
	
			}
	}
*/


