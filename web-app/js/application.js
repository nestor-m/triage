//if (typeof jQuery !== 'undefined') {
//	(function($) {
//		$('#spinner').ajaxStart(function() {
//			$(this).fadeIn();
//		}).ajaxStop(function() {
//			$(this).fadeOut();
//		});
//	})(jQuery);
//}

/*Comentario de prueba*/


function PersonaController( $scope, $routeParams, $http ) {

    // description for a new todo
    $scope.nombre = ""
    $scope.apellido = ""
//    $scope.fechaNac = now()
    $scope.dni = 0
    $scope.direccion = ""
    $scope.telefono = 0
    $scope.obraSocial = ""
    $scope.nroAfiliado = ""
    $scope.personas = []

    // load all todos, copying to the "todos" list on success
    $scope.loadPersonas = function() {
        $http.get("persona/ajaxList").success( function( data ) {
            $scope.personas = data
        })
    }

    // save a new todo, based on the "description" property
    $scope.addPersona = function() {
        $http.post(
            "persona/ajaxSave",
            {
                nombre : $scope.nombre,
                apellido : $scope.apellido,
//                fechaNac : $scope.fechaNac
                dni : $scope.dni,
                direccion : $scope.direccion,
                telefono : $scope.telefono,
                obraSocial : $scope.obraSocial,
                nroAfiliado : $scope.nroAfiliado
            }
        ).success( function( data ) {
            $scope.personas = data
            $scope.nombre = ""
            $scope.apellido = ""
//                $scope.fechaNac = now()
            $scope.dni = 0
            $scope.direccion = ""
            $scope.telefono = 0
            $scope.obraSocial = ""
            $scope.nroAfiliado = ""
        })
    }

    

    // when we first stat up, load todos
    $scope.loadPersonas()
}
