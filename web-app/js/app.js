var app = angular.module('app', [ 'ngRoute', 'ngGrid', 'checklist-model',
		'ngCookies', 'ngDropdowns' ]);

app.config(function($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl : 'busqueda_ingreso_paciente.html',
		controller : 'busquedaController'
	})

	.when('/datos_maestros', {
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

	.when('/reporte_prioridades', {
		templateUrl : 'reporte_prioridades.html',
		controller : 'reportePrioridadesController'
	})

	.when('/pacientes_espera', {
		templateUrl : 'pacientes_espera.html',
		controller : 'pacientesEsperaController'
	});
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

/** ****************************************************************************************** */
app
		.controller(
				'pacienteIngresadoController',
				function($scope, $cookieStore, $http, $location) {


					$scope.esPrioridadUno = false;
					$scope.pacienteActual = $cookieStore.get('pacienteActual');

					$scope.finalizarTriage = function() {
						// submit de impresion visual, sintomas, signos vitales
						// y calcula la prioridad
						$http
								.post(
										"paciente/finalizarTriage",
										{
											id : $scope.pacienteActual.id,
											sintomasImpresionVisual : $scope.paciente.sintomas,
											sintomas : $scope.sintomas,
											sistole : $scope.sistole == '' ? undefined
													: $scope.sistole,
											diastole : $scope.diastole == '' ? undefined
													: $scope.diastole,
											pulso : $scope.pulso == '' ? undefined
													: $scope.pulso,
											frecuenciaRespiratoria : $scope.frecuenciaRespiratoria == '' ? undefined
													: $scope.frecuenciaRespiratoria,
											temperatura : $scope.temperatura == '' ? undefined
													: $scope.temperatura,
											saturacionO2 : $scope.saturacionO2 == '' ? undefined
													: $scope.saturacionO2,
											glucosa : $scope.glucosa == '' ? undefined
													: $scope.glucosa
										}).success(function(data) {
									$cookieStore.put('datosPaciente', data);
									if (data.prioridad == 'DOS') {// nunca
																	// puede ser
																	// prioridad
																	// UNO en
																	// esta
																	// instancia
										$location.path("/prioridad2");
									} else {
										$location.path("/prioridad3");
									}
								});

					};

					$scope.salir = function() {
						$cookieStore.remove('pacienteActual');
						$scope.pacienteActual = null;
						$location.path("/");
					};

					/* IMPRESION VISUAL */
					$scope.sintomasImpresionVisual = [];

					$scope.paciente = {
						sintomas : []
					};

					$scope.traerSintomasImpresionVisual = function() {
						$http.get("sintoma/ajaxListVisuales").success(
								function(data) {
									$scope.sintomasImpresionVisual = data;
								});
						$http.post("paciente/getSintomasVisuales", {
							id : $scope.pacienteActual.id
						}).success(function(data) {
							$scope.paciente.sintomas = data;
						});
					};

					$scope.cargarImpresionVisual = function() {
						$http
								.post("paciente/cargarSintomasYResponder", {
									id : $scope.pacienteActual.id,
									esPrioridadUno : $scope.esPrioridadUno,
									sintomas : $scope.paciente.sintomas
								})
								.success(
										function(data) {
											// en data viene el paciente
											if ($scope.esPrioridadUno) {
												$cookieStore.put(
														'datosPaciente', data);
												$location.path("/prioridad1");
											} else {
												bootbox
														.alert("Impresión visual cargada con éxito");
											}
										});
					};

					$scope.traerSintomasImpresionVisual();

					$scope.checkImpresionVisual = function(event, sintoma) {
						if(!event.currentTarget.checked) return;//si se deschequeo no hago nada
						if (($scope.pacienteActual.esAdulto && sintoma.prioridadAdulto.name == "UNO")|| // es adulto
								(!$scope.pacienteActual.esAdulto && sintoma.prioridadPediatrico.name == "UNO")) {// es
																													// pediatrico
							bootbox
									.confirm(
											"¿Está seguro que desea ingresar el síntoma?",
											function(confirma) {
												if (confirma) {
													$scope.esPrioridadUno = true;
													$scope
															.cargarImpresionVisual();
												} else {
													event.currentTarget.checked = false;// si
																						// cancela
																						// deschequeo
																						// el
																						// checkbox
												}
											});
						}
					};

					/* INGRESO DE SINTOMAS */
					$scope.sintomas = [];

					$scope.recuperarSintomas = function() {
						$http.post("sintoma/recuperarSintomas", {
							id : $scope.pacienteActual.id,
						}).success(function(data) {
							$scope.sintomas = data;
						});
					}

					$scope.recuperarSintomas();

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
								esAdulto : $scope.pacienteActual.esAdulto
							}).success(function(data) {
								$scope.setPagingData(data, page, pageSize);
							})

						}, 100);
					};

					$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
							$scope.pagingOptions.currentPage);

					$scope.botonAgregarSintoma = '<button type="button" class="btn btn-primary btn-xs" ng-click="agregarSintoma(row)" name="botonAgregarSintoma">Agregar</button>';

					$scope.agregarSintoma = function(row) {
						// primero chequeo si es un sintoma de PRIORIDAD 1
						if (row.entity.prioridad == "UNO") {
							bootbox.confirm(
									"¿Está seguro que desea ingresar el síntoma?<br>"
											+ row.entity.nombre, function(
											confirma) {
										if (confirma) {
											$scope.sintomas.push(row.entity);
											$scope.esPrioridadUno = true;
											$scope.enviarSintomas();
										}
									});
							return;
						}

						var repetido = false;
						for (var i = 0; i < $scope.sintomas.length; i++) {
							if ($scope.sintomas[i].id == row.entity.id) {
								repetido = true;
								break;
							}
						}
						if (!repetido) {
							$scope.sintomas.push(row.entity);
						}
					};

					$scope.filtrarListadoDeSintomas = function() {
						$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
								$scope.pagingOptions.currentPage);
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
							displayName : 'Sintoma'
						}, {
							field : 'tipoDeSintoma',
							displayName : 'Discriminante',
							width : 200
						}, {
							cellTemplate : $scope.botonAgregarSintoma,
							width : 70
						} ]
					};

					$scope.enviarSintomas = function() {
						$http.post('paciente/cargarSintomasYResponder', {
							id : $scope.pacienteActual.id,
							esPrioridadUno : $scope.esPrioridadUno,
							sintomas : $scope.sintomas
						}).success(function(data) {
							if ($scope.esPrioridadUno) {
								$cookieStore.put('datosPaciente', data);
								$location.path("/prioridad1");
							} else {
								bootbox.alert("Síntomas cargados con éxito");
							}
						});
					};

					/* INGRESO DE SIGNOS VITALES */
					$scope.temperaturas = ['menos de 35','35-37','37.1-37.9','38.0-38.5','38.6-39.4','39.5-41.0','más de 41.0'];
					$scope.glucosas = ['menos de 50','51-100','101-150','151-200','201-300','más de 300'];
					$scope.saturacionesO2 = ['menos de 95','95-97','más de 97'];
					if($scope.pacienteActual.esAdulto){
						$scope.pulsos = ['menos de 60','70','80','90','100','110','120','más de 120'];
						$scope.frecuenciasRespiratorias = ['menos de 12','12-15','16-20','21-25','26-30','más de 30'];
						$scope.sistoles = ['menos de 85','90','100','110','120','130','140','150','160','170','180','190','200','más de 200'];
						$scope.diastoles = ['menos de 50','60','70','75','80','85','90','95','100','105','110','más de 110'];
					}else{//es pediatrico
						$scope.pulsos = ['menos de 50', '50-60', '61-70', '71-80', '81-90', '91-100', '101-110', '111-120', '121-130', '131-140', '141-150', '151-160', '161-170', '171-180', '181-190', 'más de 190'];
						$scope.frecuenciasRespiratorias = ['menos de 10', '10-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', 'más de 60'];
						$scope.sistoles = ['menos de 60', '60-70', '71-84', '85-90', '91-100', '101-110', '111-120', '121-130', '131-140', '141-150', '151-165', 'más de 165'];
						$scope.diastoles = ['menos de 30', '30-35',  '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70', '71-75', '76-80', '81-85', '86-90', '91-95', '96-100', 'más de 100'];
					}


					$scope.recuperarSignosVitales = function() {
						$http
								.post("paciente/getSignosVitales", {
									id : $scope.pacienteActual.id
								})
								.success(
										function(data) {
											$scope.pulso = data.pulso;
											$scope.temperatura = data.temperatura;
											$scope.sistole = data.sistole;
											$scope.diastole = data.diastole;
											$scope.frecuenciaRespiratoria = data.frecuenciaRespiratoria;
											$scope.saturacionO2 = data.saturacionO2;
											$scope.glucosa = data.glucosa;
										})
					}

					$scope.recuperarSignosVitales();

					$scope.enviarSignosVitales = function() {
						$http
								.post(
										"paciente/cargarSignosVitalesYResponder",
										{
											id : $scope.pacienteActual.id,
											esPrioridadUno : $scope.esPrioridadUno,
											sistole : $scope.sistole == '' ? undefined : $scope.sistole,
											diastole : $scope.diastole == '' ? undefined : $scope.diastole,
											pulso : $scope.pulso == '' ? undefined : $scope.pulso,
											frecuenciaRespiratoria : $scope.frecuenciaRespiratoria == '' ? undefined : $scope.frecuenciaRespiratoria,
											temperatura : $scope.temperatura == '' ? undefined : $scope.temperatura,
											saturacionO2 : $scope.saturacionO2 == '' ? undefined : $scope.saturacionO2,
											glucosa : $scope.glucosa == '' ? undefined : $scope.glucosa
										})
								.success(
										function(data) {
											if ($scope.esPrioridadUno) {
												$cookieStore.put(
														'datosPaciente', data);
												$location.path("/prioridad1");
											} else {
												bootbox
														.alert("Signos vitales cargados con éxito");
											}
										})

					};

					$scope.chequearPrioridadSignoVital = function(modelo, label) {
						if ($scope[modelo] == null)
							return;// es nulo cuando se selecciona el valor
									// default del select

						if ($scope.pacienteActual.esAdulto) {
							$scope.chequearSignosVitalesAdulto(modelo, label)
						} else {// es pediatrico
							switch ($scope.pacienteActual.categoriaPediatrico) {
							case 'menorDeUnAnio':
								$scope.chequearSignosVitalesMenorDeUnAnio(
										modelo, label)
								break;
							case 'menorDe6Anios':
								$scope.chequearSignosVitalesMenorDe6Anios(
										modelo, label)
								break;
							case 'mayorDe6Anios':
								$scope.chequearSignosVitalesMayorDe6Anios(
										modelo, label)
							}
						}
					};

					$scope.chequearSignosVitalesAdulto = function(modelo, label) {
						if ($scope.sistole == 'menos de 85' || $scope.sistole == 'más de 200'
								|| $scope.diastole == 'menos de 50' || $scope.diastole == 'más de 110'
								|| $scope.pulso == 'menos de 60' || $scope.pulso == 'más de 120'
								|| $scope.saturacionO2 == 'menos de 95'
								|| $scope.frecuenciaRespiratoria == 'menos de 12' || $scope.frecuenciaRespiratoria == 'más de 30'
								|| $scope.temperatura == 'menos de 35' || $scope.temperatura == 'más de 41.0'
								|| $scope.glucosa == 'menos de 50') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					//retorna true si el array contiene el valor
					function contains(array,valor){
						return array.indexOf(valor) != -1;
					}

					$scope.chequearSignosVitalesMenorDeUnAnio = function(modelo, label) {
						var sistoleMasDe120 = contains(['121-130', '131-140', '141-150', '151-165', 'más de 165'],$scope.sistole);
						var diastoleMasDe70 = contains(['71-75', '76-80', '81-85', '86-90', '91-95', '96-100', 'más de 100'],$scope.diastole); 
						var pulsoMenosDe80 = contains(['menos de 50', '50-60', '61-70', '71-80'],$scope.pulso);
						var frecRespiratoriaMenosDe15 = contains(['menos de 10','10-15'],$scope.frecuenciaRespiratoria);

						if ($scope.sistole == 'menos de 60' || sistoleMasDe120
								|| $scope.diastole  == 'menos de 30' || diastoleMasDe70
								|| pulsoMenosDe80 || $scope.pulso == 'más de 190'
								|| $scope.saturacionO2 == 'menos de 95'
								|| frecRespiratoriaMenosDe15 || $scope.frecuenciaRespiratoria == 'más de 60'		
								|| $scope.glucosa == 'menos de 50' || $scope.glucosa == 'más de 300') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					$scope.chequearSignosVitalesMenorDe6Anios = function(modelo, label) {
						var sistoleMenosDe70 = contains(['menos de 60', '60-70'],$scope.sistole);
						var sistoleMasDe150 = contains(['151-165', 'más de 165'],$scope.sistole);	
						var diastoleMenosDe40 = contains(['menos de 30', '30-35',  '36-40'],$scope.diastole);
						var diastoleMasDe90 = contains(['91-95', '96-100', 'más de 100'],$scope.diastole);
						var pulsoMenosDe60 = contains(['menos de 50', '50-60'],$scope.pulso);
						var pulsoMasDe170 = contains(['171-180', '181-190', 'más de 190'],$scope.pulso);
						var frecRespiratoriaMasDe50 = contains(['51-55', '56-60', 'más de 60'],$scope.frecuenciaRespiratoria);

						if (sistoleMenosDe70 || sistoleMasDe150
								|| diastoleMenosDe40 || diastoleMasDe90
								|| pulsoMenosDe60 || pulsoMasDe170
								|| $scope.saturacionO2 == 'menos de 95'
								|| $scope.frecuenciaRespiratoria == 'menos de 10' || frecRespiratoriaMasDe50								
								|| $scope.glucosa == 'menos de 50' || $scope.glucosa == 'más de 300') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					$scope.chequearSignosVitalesMayorDe6Anios = function(modelo, label) {
						var sistoleMenosDe85 = contains(['menos de 60', '60-70', '71-84'],$scope.sistole);
						var diastoleMenosDe50 = contains(['menos de 30', '30-35',  '36-40', '41-45', '46-50'],$scope.diastole);
						var pulsoMasDe160 = contains(['161-170', '171-180', '181-190', 'más de 190'],$scope.pulso);
						var frecRespiratoriaMasDe40 = contains(['41-45', '46-50', '51-55', '56-60', 'más de 60'],$scope.frecuenciaRespiratoria);

						if ( sistoleMenosDe85 || $scope.sistole == 'más de 165'
								|| diastoleMenosDe50 || $scope.diastole == 'más de 100'
								|| $scope.pulso == 'menos de 50' || pulsoMasDe160
								|| $scope.saturacionO2 == 'menos de 95'
								|| $scope.frecuenciaRespiratoria == 'menos de 10' || frecRespiratoriaMasDe40
								|| $scope.glucosa == 'menos de 50' || $scope.glucosa == 'más de 300') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					$scope.mostrarMensajeDeConfirmacion = function(modelo,
							label) {
						bootbox.confirm(
								"¿Está seguro que desea ingresar el siguiente valor? <br>"
										+ label + ": " + $scope[modelo],
								function(confirma) {
									if (confirma) {
										$scope.esPrioridadUno = true;
										$scope.enviarSignosVitales();
									} else {
										$scope[modelo] = '';// vacio el campo
										$scope.$apply();// actualizo la vista
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
app.controller('reportePrioridadesController', function($scope, $location,
		$cookieStore, $http) {

	$scope.prioridades = [];
	
	$scope.traerReporte = function() {
		$http.post("paciente/cantidadDeConsultasSegunPrioridad", {
			fechaDesde : $scope.fechaDesde,
			fechaHasta : $scope.fechaHasta
		}).success(function(data) {
			$cookieStore.put('datos', data); 
			$scope.prioridades = data;
		});

	};

});

/** ****************************************************************************************** */
app.directive('datosPaciente', function() {
	return {
		templateUrl : 'datosPaciente.html'
	}
});

/** ****************************************************************************************** */
app
		.controller(
				'pacientesEsperaController',
				function($scope, $location, $cookieStore, $http) {

					$scope.botonTriage = '<button type="button" class="btn btn-primary btn-xs" ng-click="ingresarPaciente(row)" name="botonSeleccionarPaciente">Triage</button>'
					$scope.botonFinalizar = '<button type="button" class="btn btn-primary btn-xs" ng-click="finalizarPaciente(row)" name="botonFinalizarPaciente">Finalizar</button>'

					$scope.totalServerItems = 0;

					$scope.ingresarPaciente = function(row) {
						$http.post("paciente/cargarPacienteEnEspera",
								row.entity).success(function(data) {
							$cookieStore.put('pacienteActual', data); 
							$location.path("/paciente_ingresado");
						});

					};

					$scope.finalizarPaciente = function(row) {
						$http.post("paciente/cargarPacienteEnEspera",
								row.entity).success(function(data) {
							$cookieStore.put('pacienteActual', data); 
							$location.path("/finalizar_paciente");
						});
					}

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
							displayName : 'Nombre',
							width : 240
						}, {
							field : 'edad',
							displayName : 'Edad',
							width : 50
						}, {
							field : 'demora',
							displayName : 'Espera',
							width : 100
						}, {
							field : 'prioridad',
							displayName : 'Prioridad',
							width : 150
						}, {
							cellTemplate : $scope.botonTriage,
							width : 70
						}, {
							cellTemplate : $scope.botonFinalizar,
							width : 70
						} ]
					};

					$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
							$scope.pagingOptions.currentPage);

				});
/**
 * ***************************** FINALIZAR PACIENTE * *********************************************
 */
app
		.controller(
				'finalizarPacienteController',
				function($scope, $location, $cookieStore, $http) {

					$scope.pacienteActual = $cookieStore.get('pacienteActual');					

					$scope.ingresa = {
						"id" : "1",
						"value" : 1
					};
					$scope.consultorio = {
						"id" : "2",
						"value" : 2
					};
					$scope.retira = {
						"id" : "3",
						"value" : 3
					};

					$scope.traerDatosPaciente = function(){
						$http.post("paciente/traerDatosPaciente", {
							id : $scope.pacienteActual.id
						}).success(function(data) {
							$scope.paciente = data;
							$scope.prioridad = data.prioridad;
						});
					};

					$scope.traerDatosPaciente();

					$scope.finalizarTriage = function() {
						$http.post("paciente/calcularPrioridad", {
							id : $scope.pacienteActual.id
						}).success(function(data) {
							$scope.prioridad = data.prioridad;
						});
					};

					if($scope.pacienteActual.prioridad == 'No se ha calculado'){//solamente llamo a finalizar triage si todavia no tiene prioridad
						$scope.finalizarTriage();
					};

					$scope.finalizarAtencion = function() {
						bootbox
								.confirm(
										"¿Está seguro que desea finalizar la atención del paciente?<br>",
										function(confirma) {
											if (confirma) {
												$scope
														.enviarDatosFinalizacion();
											}
										});
					};

					$scope.enviarDatosFinalizacion = function() {
						$http.post("paciente/finalizarPaciente", {
							tipoFin : $scope.opciones.value,
							id : $scope.pacienteActual.id
						}).success(function() {
							$location.path("/pacientes_espera");
						});
					};

				});