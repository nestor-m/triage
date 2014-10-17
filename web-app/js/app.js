var app = angular.module('app', [ 'ngRoute', 'ngGrid', 'checklist-model',
		'ngCookies', 'ngDropdowns' ]);

app.controller('indexController',function($rootScope,$location,$http,$cookieStore) {
	$rootScope.usuario = $cookieStore.get('usuario');

	$rootScope.logout = function(){
		$http.get('usuario/logout').success(function(){
			$rootScope.usuario = null;
			$cookieStore.remove('usuario');
			$location.path('/');
		});
	}
});

app.config(function($routeProvider) {
	$routeProvider

	.when('/',{
		templateUrl : 'login.html',
		controller : 'loginController'
	})

	.when('/busqueda_ingreso_paciente', {
		templateUrl : 'busqueda_ingreso_paciente.html',
		controller : 'busquedaController'
	})

	.when('/reportes', {
		templateUrl : 'lista_pacientes.html',
		controller : 'personaController'
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
	}).when('/reporte_tiempo_espera', {
		templateUrl : 'reporte_espera.html',
		controller : 'reporteTiempoEsperaController'
	})

	.when('/pacientes_espera', {
		templateUrl : 'pacientes_espera.html',
		controller : 'pacientesEsperaController'
	})
	
	.when('/busqueda_personas', {
		templateUrl : 'busqueda_personas.html',
		controller : 'busquedaPersonasController'
	})
	
	.when('/detalle_personas', {
		templateUrl : 'detalle_personas.html',
		controller : 'detallePersonaController'
	})

	//ABM sintomas
	.when('/sintomas_list', {
		templateUrl : 'sintomas_listado.html',
		controller : 'sintomasListadoController'
	})	

	.when('/sintomas_form', {
		templateUrl : 'sintomas_form.html',
		controller : 'sintomasFormularioController'
	})

	//ABM tipos de sintomas
	.when('/discriminantesListado', {
		templateUrl : 'tiposDeSintomaListado.html',
		controller : 'tiposDeSintomaListController'
	})

	.when('/discriminantesForm', {
		templateUrl : 'tiposDeSintomaForm.html',
		controller : 'tiposDeSintomaFormController'
	})

	//ABM usuarios
	.when('/usuariosListado', {
		templateUrl : 'usuariosListado.html',
		controller : 'usuariosListadoController'
	})

	.when('/usuariosForm', {
		templateUrl : 'usuariosForm.html',
		controller : 'usuariosFormController'
	})

	//CAMBIAR PASSWORD
	.when('/cambiarPassword',{
		templateUrl : 'cambiarPassword.html',
		controller : 'cambiarPasswordController'
	});

});


//catch de los errores 401 que tira Grails cuando se intenta hacer algo sin estar logueado
//fuente: http://blog.thesparktree.com/post/75952317665/angularjs-interceptors-globally-handle-401-and-other
app.factory('authHttpResponseInterceptor',['$q','$location','$rootScope',function($q,$location,$rootScope){//aca no me deja injectar $scope
    return {
        response: function(response){
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $location.path('/');
                $rootScope.logout();
            }
            return $q.reject(rejection);
        }
    }
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);

/** ************************************************************************************** */
// Este servicio no se usa, pero lo dejo para tenerlo de ejemplo. Se puede usar
// para pasar data entre controllers pero se pierde la info
// al refrescar la pagina, por eso finalmente optamos por usar $cookieStore
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

 /*LOGIN CONTROLLER* ************************************************************************************** */

 app.controller('loginController', function($rootScope,$scope,$http,$location,$cookieStore) {

 	if($rootScope.usuario != null){//si ya estoy logueado me dirige a la pantalla de inicio
 		$location.path('/busqueda_ingreso_paciente');
 	}

 	$scope.falloLogin = false;

	$scope.login = function() {
		$http.post('usuario/login',{
			usuario: $scope.nombre,
			password: $scope.password
		}).success(function(usuario){
			$cookieStore.put('usuario',usuario);
			//mostrarMenu(usuario);
			$rootScope.usuario = usuario;
			$location.path('/busqueda_ingreso_paciente');
		}).error(function(){
			$scope.falloLogin = true;
		});		
	}

});

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

app.controller(
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
							});

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
							displayName : 'DNI',
							width: 130
						}, {
							field : 'fechaDeNacimiento',
							displayName : 'Fecha de nacimiento',
							cellFilter : 'date:\'dd/MM/yyyy\'',
							width: 130
						}, {
							field : 'direccion',
							displayName : 'Dirección'
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

/**PACIENTE INGRESADO****************************************************************************************** */
app.controller(
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
										switch (data.prioridad) {
											case 'UNO':
												$location.path("/prioridad1");
												break; 
											case 'DOS':
												$location.path("/prioridad2");
												break; 
											case 'TRES': 
												$location.path("/prioridad3");
										}
									});
					};

					$scope.salir = function() {
						$cookieStore.remove('pacienteActual');
						$scope.pacienteActual = null;
						$location.path("/busqueda_ingreso_paciente");
					};

					/* IMPRESION VISUAL */
					$scope.sintomasImpresionVisual = [];//todos los sintomas de impresion visual

					$scope.paciente = {
						sintomas : []//sintomas de impresion visual cargados al paciente
					};

					$scope.traerSintomasImpresionVisual = function() {
						$http.get("sintoma/ajaxListVisuales").success(
								function(data) {
									$scope.sintomasImpresionVisual = data;
								});
						/*$http.post("paciente/getSintomasVisuales", {//ya no se usa, ahora trae todo recuperarSintomas
							id : $scope.pacienteActual.id
						}).success(function(data) {
							$scope.paciente.sintomas = data;
						});*/
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
												$cookieStore.put('datosPaciente', data);
												$location.path("/prioridad1");
											} else {
												bootbox.alert("Impresión visual cargada con éxito");
											}
										});
					};

					$scope.traerSintomasImpresionVisual();

					$scope.checkImpresionVisual = function(event, sintoma) {
						if (!event.currentTarget.checked){//si se deschequeo
							$scope.borrarSintoma(sintoma);							
						}else{//si se checkeo

							$scope.sintomas.push(sintoma);

							if (($scope.pacienteActual.esAdulto && sintoma.prioridadAdulto.name == "UNO")
									|| 
									(!$scope.pacienteActual.esAdulto && sintoma.prioridadPediatrico.name == "UNO")) {
								
								bootbox.confirm("¿Está seguro que desea ingresar el síntoma?",
												function(confirma) {
													if (confirma) {
														$scope.esPrioridadUno = true;
														$scope.cargarImpresionVisual();
													} else {
														event.currentTarget.checked = false;// si cancela deschequeo el checkbox
														//y lo saco del array de sintomas de impresion visual agregados
														var i = $scope.paciente.sintomas.indexOf(sintoma);
														$scope.paciente.sintomas.splice(i, 1);
													}
												});
							}
						}
					};

					/* INGRESO DE SINTOMAS */
					$scope.sintomas = [];

					$scope.recuperarSintomas = function() {
						$http.post("sintoma/recuperarSintomas", {
							id : $scope.pacienteActual.id,
						}).success(function(data) {
							$scope.sintomas = data;
							for(var i = 0; i < data.length; i++){
								if(data[i].tipoDeSintoma.id==1)//si es sintoma de IMPRESION INICIAL
									$scope.paciente.sintomas.push(data[i]);
							}							
						});
					}

					$scope.recuperarSintomas();

					$scope.borrarSintoma = function(sintoma) {						
						for (var i = 0; i < $scope.sintomas.length; i++){//lo elimino de los sintomas q no son de impresion visual
							if($scope.sintomas[i].id == sintoma.id){
								$scope.sintomas.splice(i, 1);
								break;
							}
						}
						if(sintoma.tipoDeSintoma.id == 1 || sintoma.tipoDeSintoma == 'IMPRESION INICIAL'){//si es sintoma de IMPRESION INICIAL
							for (var i = 0; i < $scope.paciente.sintomas.length; i++){//lo elimino de los sintomas de impresion visual
								if($scope.paciente.sintomas[i].id == sintoma.id){
									$scope.paciente.sintomas.splice(i, 1);
									break;
								}
							}
						}
					};

					$scope.totalServerItems = 0;

					$scope.pagingOptions = {
						pageSizes : [ 5, 10, 15 ],
						pageSize : 5,
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
							$http.post('sintoma/sintomasListado', {
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
						if ((row.entity.prioridadAdulto == "UNO" && $scope.pacienteActual.esAdulto) ||
							(row.entity.prioridadPediatrico == "UNO" && !$scope.pacienteActual.esAdulto)
							) {
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
							if(row.entity.tipoDeSintoma == 'IMPRESION INICIAL'){//si es de impresion inicial tambien lo chequeo en la pantalla de impresion inicial
								for (var i = 0; i < $scope.sintomasImpresionVisual.length; i++) {
									if($scope.sintomasImpresionVisual[i].id==row.entity.id){
										$scope.paciente.sintomas.push($scope.sintomasImpresionVisual[i]);
										break;
									}
								}								
							}								
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
							displayName : 'Sintoma',
							width : '50%'
						}, {
							field : 'tipoDeSintoma',
							displayName : 'Discriminante',
							width : '40%'
						}, {
							cellTemplate : $scope.botonAgregarSintoma,
							width : '10%'
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
					$scope.temperaturas = [ 'menos de 35', '35-37',
							'37.1-37.9', '38.0-38.5', '38.6-39.4', '39.5-41.0',
							'más de 41.0' ];
					$scope.glucosas = [ 'menos de 50', '51-100', '101-150',
							'151-200', '201-300', 'más de 300' ];
					$scope.saturacionesO2 = [ 'menos de 95', '95-97',
							'más de 97' ];
					if ($scope.pacienteActual.esAdulto) {
						$scope.pulsos = [ 'menos de 60', '70', '80', '90',
								'100', '110', '120', 'más de 120' ];
						$scope.frecuenciasRespiratorias = [ 'menos de 12',
								'12-15', '16-20', '21-25', '26-30', 'más de 30' ];
						$scope.sistoles = [ 'menos de 85', '90', '100', '110',
								'120', '130', '140', '150', '160', '170',
								'180', '190', '200', 'más de 200' ];
						$scope.diastoles = [ 'menos de 50', '60', '70', '75',
								'80', '85', '90', '95', '100', '105', '110',
								'más de 110' ];
					} else {// es pediatrico
						$scope.pulsos = [ 'menos de 50', '50-60', '61-70',
								'71-80', '81-90', '91-100', '101-110',
								'111-120', '121-130', '131-140', '141-150',
								'151-160', '161-170', '171-180', '181-190',
								'más de 190' ];
						$scope.frecuenciasRespiratorias = [ 'menos de 10',
								'10-15', '16-20', '21-25', '26-30', '31-35',
								'36-40', '41-45', '46-50', '51-55', '56-60',
								'más de 60' ];
						$scope.sistoles = [ 'menos de 60', '60-70', '71-84',
								'85-90', '91-100', '101-110', '111-120',
								'121-130', '131-140', '141-150', '151-165',
								'más de 165' ];
						$scope.diastoles = [ 'menos de 30', '30-35', '36-40',
								'41-45', '46-50', '51-55', '56-60', '61-65',
								'66-70', '71-75', '76-80', '81-85', '86-90',
								'91-95', '96-100', 'más de 100' ];
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
						if ($scope.sistole == 'menos de 85'
								|| $scope.sistole == 'más de 200'
								|| $scope.diastole == 'menos de 50'
								|| $scope.diastole == 'más de 110'
								|| $scope.pulso == 'menos de 60'
								|| $scope.pulso == 'más de 120'
								|| $scope.saturacionO2 == 'menos de 95'
								|| $scope.frecuenciaRespiratoria == 'menos de 12'
								|| $scope.frecuenciaRespiratoria == 'más de 30'
								|| $scope.temperatura == 'menos de 35'
								|| $scope.temperatura == 'más de 41.0'
								|| $scope.glucosa == 'menos de 50') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					// retorna true si el array contiene el valor
					function contains(array, valor) {
						return array.indexOf(valor) != -1;
					}

					$scope.chequearSignosVitalesMenorDeUnAnio = function(
							modelo, label) {
						var sistoleMasDe120 = contains([ '121-130', '131-140',
								'141-150', '151-165', 'más de 165' ],
								$scope.sistole);
						var diastoleMasDe70 = contains([ '71-75', '76-80',
								'81-85', '86-90', '91-95', '96-100',
								'más de 100' ], $scope.diastole);
						var pulsoMenosDe80 = contains([ 'menos de 50', '50-60',
								'61-70', '71-80' ], $scope.pulso);
						var frecRespiratoriaMenosDe15 = contains([
								'menos de 10', '10-15' ],
								$scope.frecuenciaRespiratoria);

						if ($scope.sistole == 'menos de 60' || sistoleMasDe120
								|| $scope.diastole == 'menos de 30'
								|| diastoleMasDe70 || pulsoMenosDe80
								|| $scope.pulso == 'más de 190'
								|| $scope.saturacionO2 == 'menos de 95'
								|| frecRespiratoriaMenosDe15
								|| $scope.frecuenciaRespiratoria == 'más de 60'
								|| $scope.glucosa == 'menos de 50'
								|| $scope.glucosa == 'más de 300') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					$scope.chequearSignosVitalesMenorDe6Anios = function(
							modelo, label) {
						var sistoleMenosDe70 = contains([ 'menos de 60',
								'60-70' ], $scope.sistole);
						var sistoleMasDe150 = contains([ '151-165',
								'más de 165' ], $scope.sistole);
						var diastoleMenosDe40 = contains([ 'menos de 30',
								'30-35', '36-40' ], $scope.diastole);
						var diastoleMasDe90 = contains([ '91-95', '96-100',
								'más de 100' ], $scope.diastole);
						var pulsoMenosDe60 = contains(
								[ 'menos de 50', '50-60' ], $scope.pulso);
						var pulsoMasDe170 = contains([ '171-180', '181-190',
								'más de 190' ], $scope.pulso);
						var frecRespiratoriaMasDe50 = contains([ '51-55',
								'56-60', 'más de 60' ],
								$scope.frecuenciaRespiratoria);

						if (sistoleMenosDe70
								|| sistoleMasDe150
								|| diastoleMenosDe40
								|| diastoleMasDe90
								|| pulsoMenosDe60
								|| pulsoMasDe170
								|| $scope.saturacionO2 == 'menos de 95'
								|| $scope.frecuenciaRespiratoria == 'menos de 10'
								|| frecRespiratoriaMasDe50
								|| $scope.glucosa == 'menos de 50'
								|| $scope.glucosa == 'más de 300') {

							$scope.mostrarMensajeDeConfirmacion(modelo, label);
						}
					};

					$scope.chequearSignosVitalesMayorDe6Anios = function(
							modelo, label) {
						var sistoleMenosDe85 = contains([ 'menos de 60',
								'60-70', '71-84' ], $scope.sistole);
						var diastoleMenosDe50 = contains([ 'menos de 30',
								'30-35', '36-40', '41-45', '46-50' ],
								$scope.diastole);
						var pulsoMasDe160 = contains([ '161-170', '171-180',
								'181-190', 'más de 190' ], $scope.pulso);
						var frecRespiratoriaMasDe40 = contains([ '41-45',
								'46-50', '51-55', '56-60', 'más de 60' ],
								$scope.frecuenciaRespiratoria);

						if (sistoleMenosDe85
								|| $scope.sistole == 'más de 165'
								|| diastoleMenosDe50
								|| $scope.diastole == 'más de 100'
								|| $scope.pulso == 'menos de 50'
								|| pulsoMasDe160
								|| $scope.saturacionO2 == 'menos de 95'
								|| $scope.frecuenciaRespiratoria == 'menos de 10'
								|| frecRespiratoriaMasDe40
								|| $scope.glucosa == 'menos de 50'
								|| $scope.glucosa == 'más de 300') {

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
app.controller('reporteTiempoEsperaController', function($scope, $location,
		$cookieStore, $http) {

	$scope.esperas = [];

	$scope.traerReporte = function() {
		$http.post("paciente/tiempoEsperaSegunPrioridad", {
			fechaDesde : $scope.fechaDesde,
			fechaHasta : $scope.fechaHasta
		}).success(function(data) {
			$cookieStore.put('datos', data);
			$scope.esperas = data;
			console.log(data);
		});

	};

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
		restrict:'A',//solo matchea con el nombre del atributo del tag
		templateUrl : 'datosPaciente.html'
	}
});

/** ****************************************************************************************** */
app.controller(
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
							width : '45%'
						}, {
							field : 'edad',
							displayName : 'Edad',
							width : '10%'
						}, {
							field : 'demora',
							displayName : 'Espera',
							width : '10%'
						}, {
							field : 'prioridad',
							displayName : 'Prioridad',
							width : '15%'
						}, {
							cellTemplate : $scope.botonTriage,
							width : '10%'
						}, {
							cellTemplate : $scope.botonFinalizar,
							width : '10%'
						} ]
					};

					$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
							$scope.pagingOptions.currentPage);

				});
/**
 * ***************************** FINALIZAR PACIENTE *
 * *********************************************
 */
app.controller(
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

					$scope.traerDatosPaciente = function() {
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

					if ($scope.pacienteActual.prioridad == 'No se ha calculado') {// solamente
																					// llamo
																					// a
																					// finalizar
																					// triage
																					// si
																					// todavia
																					// no
																					// tiene
																					// prioridad
						$scope.finalizarTriage();
					}
					;

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

/*ABM SINTOMAS*/
/**LISTADO DE SINTOMAS*************************************/
/**Esta es la pantalla del listado, el listado en si se define en una directiva mas abajo en el codigo*/
app.controller('sintomasListadoController',function($scope, $location, $cookieStore, $http,$rootScope){

	$scope.nuevoSintoma = function(){
		$cookieStore.remove('detalleSintoma');
		$location.path('/sintomas_form');
	}

	$scope.filtrarListadoDeSintomas = function() {
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
				$scope.pagingOptions.currentPage);
	};

});

/**FORMULARIO SINTOMAS*****************************************************/
app.controller('sintomasFormularioController',function($scope, $location, $cookieStore, $http){

	$scope.tiposDeSintomas = [];

	$scope.traerTiposDeSintomas = function(){
		$http.post('tipoDeSintoma/traerTiposDeSintomas')
		.success(function(data){
			$scope.tiposDeSintomas = data;
			if ($cookieStore.get('detalleSintoma') != null){
				llenarFormulario();//lo pongo aca porque es necesario que se ejecute luego de que responda el server
			}
		});
	}

	function llenarFormulario(){
		$scope.sintoma = $cookieStore.get('detalleSintoma');
		//busco tipo de sintoma		
		for(var i=0; i<$scope.tiposDeSintomas.length; i++){
    		if($scope.tiposDeSintomas[i].nombre == $scope.sintoma.tipoDeSintoma){
    			$scope.sintoma.tipoDeSintoma = $scope.tiposDeSintomas[i];//reemplazo el nombre del tipo de sintoma por el objeto tipo de sintoma
    			break;
    		}
		}
	}

	$scope.submitSintomaForm = function(){
		$http.post('sintoma/submitSintomaForm',{
			id : $scope.sintoma.id,
			nombre : $scope.sintoma.nombre,
			tipoDeSintomaId : $scope.sintoma.tipoDeSintoma.id,
			prioridadAdulto : $scope.sintoma.prioridadAdulto,
			prioridadPediatrico : $scope.sintoma.prioridadPediatrico
		}).success(function(data){
			bootbox.alert(data);
			$scope.sintoma = null;//limpio el formulario
		}).error(function(data){
			bootbox.alert(data);
		});
	};

	$scope.traerTiposDeSintomas();//traigo todos los sintomas al iniciar la pantalla

});

/**ABM tiposDeSintoma************************************************/
/**LISTADO DE TIPOS DE SINTOMA******************************************/
app.controller('tiposDeSintomaListController',function($scope, $location, $cookieStore, $http){

	$scope.totalServerItems = 0;

	$scope.pagingOptions = {
		pageSizes : [ 10, 15, 20 ],
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
			$http.post('tipoDeSintoma/traerTiposDeSintomas', {
				tipoDeSintoma : $scope.tipoDeSintoma
			}).success(function(data) {
				$scope.setPagingData(data, page, pageSize);
			})

		}, 100);
	};

	$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
			$scope.pagingOptions.currentPage);

	$scope.botonDetalleTipoDeSintoma = '<a id="verDetalle" ng-click="verDetalle(row)"> <i class="fa fa-search fa-2x" title="Ver detalle"/> </a>';

	$scope.verDetalle = function(row){
		$cookieStore.put('detalleTipoDeSintoma',row.entity);
		$location.path('/discriminantesForm');
	}

	$scope.nuevoTipoDeSintoma = function(){
		$cookieStore.remove('detalleTipoDeSintoma');
		$location.path('/discriminantesForm');
	}

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
			displayName : 'Discriminante',
			width : '95%'
		}, {
			cellTemplate : $scope.botonDetalleTipoDeSintoma,
			width : '5%'
		} ]
	};

	$scope.filtrarListadoDeTiposDeSintoma = function() {
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
				$scope.pagingOptions.currentPage);
	};

});

/**FORMULARIO DE TIPOS DE SINTOMA*****************/
app.controller('tiposDeSintomaFormController',function($scope, $location, $cookieStore, $http){

	$scope.tipoDeSintoma = $cookieStore.get('detalleTipoDeSintoma');//lleno el formulario si se presiono el boton ver detalle 
	$scope.ocultarListado = $scope.tipoDeSintoma == null;

	$scope.submitTipoDeSintomaForm = function(){
		$http.post('tipoDeSintoma/submitTipoDeSintomaForm',{
			id : $scope.tipoDeSintoma.id,
			nombre : $scope.tipoDeSintoma.nombre
		}).success(function(data){
			bootbox.alert(data);
			$scope.tipoDeSintoma = null;//limpio el formulario
		}).error(function(data){
			bootbox.alert(data);
		});
	};

});

/**LISTADO DE SINTOMAS***************************************************************/
app.directive('sintomasListado',function(){//creo una directiva para evitar repetir el codigo del listado de sintomas en el detalle del discriminante

	return{
		restrict:'E',//solo matchea con el nombre del tag
		template:'<div class="gridStyle" ng-grid="gridOptions" style="height: 380px;"> </div>',
		controller:function($scope,$http,$cookieStore,$location){

				$scope.totalServerItems = 0;

				$scope.pagingOptions = {
					pageSizes : [ 10, 15, 20 ],
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
						$http.post('sintoma/sintomasListado', {
							sintoma: $scope.sintoma,
							tipoDeSintoma: $scope.tipoDeSintoma==null?undefined:($scope.tipoDeSintoma.nombre==null?$scope.tipoDeSintoma:$scope.tipoDeSintoma.nombre),
							habilitados: $scope.habilitados
						}).success(function(data) {
							$scope.setPagingData(data, page, pageSize);
						})

					}, 100);
				};

				$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
						$scope.pagingOptions.currentPage);

				$scope.botonDetalleSintoma = '<a id="verDetalle" ng-click="verDetalle(row)"> <i class="fa fa-search fa-2x" title="Ver detalle"/> </a>';

				$scope.verDetalle = function(row){
					$cookieStore.put('detalleSintoma',row.entity);
					$location.path('/sintomas_form');
				}

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
						displayName : 'Sintoma',
						width : '45%'
					}, {
						field : 'prioridadAdulto',
						displayName : 'P. Adulto',
						width : '10%'
					}, {
						field : 'prioridadPediatrico',
						displayName : 'P. Pediatrico',
						width : '10%'
					}, {
						field : 'tipoDeSintoma',
						displayName : 'Discriminante',
						width : '30%'
					}, {
						cellTemplate : $scope.botonDetalleSintoma,
						width : '5%'
					} ]
				};
		}
	};

});


/****************************LISTADO DE PERSONAS*****************************/

app.controller('busquedaPersonasController',function($scope, $location, $cookieStore, $http){
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

	$scope.botonIngresar = '<button type="button" class="btn btn-primary btn-xs" ng-click="verDetalle(row)" name="botonSeleccionarPersona">Detalle</button>'

	$scope.verDetalle = function(row) {
		$http.post("persona/cargarPersona", row.entity)
				.success(function(data) {
					$cookieStore.put('personaActual', data); 
					$location.path("/detalle_personas");
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
			displayName : 'DNI',
			width: 130
		}, {
			field : 'fechaDeNacimiento',
			displayName : 'Fecha de nacimiento',
			cellFilter : 'date:\'dd/MM/yyyy\'',
			width: 130
		}, {
			field : 'direccion',
			displayName : 'Dirección'
		}, {
			cellTemplate : $scope.botonIngresar,
			width : 70
		} ]
	};
	
});


/****************DETALLE PERSONAS****************/

app.controller('detallePersonaController',function($scope, $location, $cookieStore, $http){
	$scope.personaActual = $cookieStore.get('personaActual');
	
	$scope.salir = function() {
		$location.path("/busqueda_personas");
	};

	
});

/**ABM USUARIOS************************************/
app.controller('usuariosListadoController',function($scope, $location, $cookieStore, $http){

	$scope.totalServerItems = 0;

	$scope.pagingOptions = {
		pageSizes : [ 10, 15, 20 ],
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
			$http.post('usuario/traerUsuarios', {
				nombre : $scope.nombre
			}).success(function(data) {
				$scope.setPagingData(data, page, pageSize);
			})

		}, 100);
	};

	$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
			$scope.pagingOptions.currentPage);

	$scope.botonVerDetalle = '<a id="verDetalle" ng-click="verDetalle(row)"> <i class="fa fa-search fa-2x" title="Ver detalle"/> </a>';
	$scope.botonEliminar = '<a id="eliminar" style="color:red" ng-click="eliminarUsuario(row)"> <i class="fa fa-times-circle fa-2x" title="Eliminar" ng-hide="usuario.nombre==row.entity.nombre"/> </a>';

	$scope.verDetalle = function(row){
		$cookieStore.put('detalleUsuario',row.entity);
		$location.path('/usuariosForm');
	}

	$scope.nuevoUsuario = function(){
		$cookieStore.remove('detalleUsuario');
		$location.path('/usuariosForm');
	}

	$scope.eliminarUsuario = function(row){
		bootbox.confirm('¿Está seguro que quiere eliminar el usuario ' + row.entity.nombre + '?',
			function(confirma){
				if(confirma){
					$http.post("usuario/eliminarUsuario",{
						id:row.entity.id
					}).success(function(data) {
							$('#alert').delay(200).fadeIn().delay(2000).fadeOut();//mensaje de sintoma eliminado con exito
							quitarUsuarioDelListado(row.entity.id);
						});
				}
			});
	}

	function quitarUsuarioDelListado(id){
		var indiceABorrar;
		for(var i=0; i<$scope.myData.length; i++){
			if($scope.myData[i].id == id){
				indiceABorrar = i;
				break;
			}
		}
		$scope.myData.splice(indiceABorrar,1);		
		$scope.totalServerItems--;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}

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
			displayName : 'Usuario',
			width : '90%'
		}, {
			cellTemplate : $scope.botonVerDetalle,
			width : '5%'
		}, {
			cellTemplate : $scope.botonEliminar,
			width : '5%'
		} ]
	};

	$scope.filtrarListadoDeUsuarios = function() {
		$scope.getPagedDataAsync($scope.pagingOptions.pageSize,
				$scope.pagingOptions.currentPage);
	};

});

/**FORMULARIO DE USUARIOS*************************/
app.controller('usuariosFormController',function($scope, $location, $cookieStore, $http){

	$scope.usuario = $cookieStore.get('detalleUsuario');//lleno el formulario si se presiono el boton ver detalle 

	if($scope.usuario != null){
		$scope.usuario.rol = $scope.usuario.rol.name;//pongo el nombre del objeto rol para cargar el formulario
	};

	$scope.submit = function(){
		$http.post('usuario/submit',{
			usuario : $scope.usuario
		}).success(function(data){
			bootbox.alert(data);			
			$scope.usuario = null;//limpio el formulario
		});
	};

	$scope.chequearLargoNombre = function(){
		$scope.nombreCorto = $scope.usuario.nombre.length < 3;
	};

});


/**CAMBIAR PASSWORD*************************/
app.controller('cambiarPasswordController',function($rootScope, $scope, $location, $cookieStore, $http){

	$(document).ready(function(){//evito con jquery que se pueda copypastear en el campo Repita nueva password
      $('#repite').bind("cut copy paste",function(e) {
          e.preventDefault();
      });
    });

	$scope.pass = {};

	$scope.chequearLargo = function(){
		$scope.passDemasiadoCorta = $scope.pass.nueva.length < 4;
	};

	$scope.chequearNuevaPassCoincide = function(){
		$scope.passNoCoinciden = $scope.pass.nueva != $scope.pass.repite;
	};

	$scope.submit = function(){
		$http.post('usuario/cambiarPass',{
			usuario : $rootScope.usuario,//usuario logueado
			pass : $scope.pass
		}).success(function(data){
			bootbox.alert(data);			
			$location.path('/busqueda_ingreso_paciente');
		}).error(function(data){
			bootbox.alert(data);
		});
	};

});


