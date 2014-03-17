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
		templateUrl : 'prioridad1.html'
	})
	
	.when('/prioridad2', {
		templateUrl : 'prioridad2.html'
	})
	
	.when('/lista_pacientes', {
		templateUrl : 'lista_pacientes.html',
		controller : 'personaController'
	})
	
	.when('/ingreso_form', {
		templateUrl : 'ingreso_form.html',
		controller : 'personaController'
	})
	
	.when('/carga_sintomas', {
		templateUrl : 'carga_sintomas.html',
		controller : 'cargaSintomasController'
	});

});

/*****************************************************************************************/
//Este servicio no se usa, pero lo dejo para tenerlo de ejemplo. Se puede usar para pasar data entre controllers pero se pierde la info 
//al refrescar la pagina, por eso opte po $cookieStore
//Para usarlo en un controller hay que pasarlo por parametro, ej:
//app.controller('personaController', function($scope, $http,	$location, pacienteActualService){...});
app.service('pacienteActualService', function() {

	  this.setPaciente = function(unPaciente) {
		  this.paciente = unPaciente;
	  };
	  
	  this.getPaciente = function(){
	      return this.paciente;
	  };
	});

/*****************************************************************************************/

app.controller('personaController', function($scope, $http,	$location, pacienteActualService, $cookieStore) {

	
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
				$location.path("/impresion_visual");
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

app.controller('busquedaController',function($scope, $http, $location) {

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
							app.pacienteActual = data; //me guardo el paciente
							$location.path("/impresion_visual");
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
		$http.post("paciente/cargarImpresionInicial", {
			id : $scope.pacienteActual.id,
			sintomas: $scope.paciente.sintomas
		}).success(function(data) {
			//en data viene el paciente
			if (data.prioridad != null && data.prioridad.name == "UNO"){
				$location.path("/prioridad1");
			}		
			else {
				//finalizo x ahora
				$location.path("/prioridad2");
			}
		});
	};

	$scope.loadSintomas();
});

/**********************************************************************************************************/

app.controller('cargaSintomasController',function($scope, $http, $location) {
	
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
		$scope.sintomas.push(row.entity.nombre);
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

});




















/*************************checklistmodel*****************************/

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 */

angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item) {
    arr = angular.isArray(arr) ? arr : [];
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], item)) {
        return arr;
      }
    }    
    arr.push(item);
    return arr;
  }  

  // remove
  function remove(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;

    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);

    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (newValue === true) {
        setter(scope.$parent, add(current, value));
      } else {
        setter(scope.$parent, remove(current, value));
      }
    });

    // watch original model change
    scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
      scope.checked = contains(newArr, value);
    }, true);
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
        throw 'checklist-model should be applied to `input[type="checkbox"]`.';
      }

      if (!tAttrs.checklistValue) {
        throw 'You should provide `checklist-value`.';
      }

      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');

      return postLinkFn;
    }
  };
}]);
