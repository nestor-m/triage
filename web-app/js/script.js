var triageApp = angular.module('triageApp', ['ngRoute']);

	// configure our routes
	triageApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'inicio.html', 
				controller  : 'mainController'
			})
			
			.when('/datos_maestros', {
				templateUrl : 'inicio.html', 
				controller  : 'mainController'
			})
			
			.when('/reportes', {
				templateUrl : 'inicio.html', 
				controller  : 'mainController'
			})

			// route for the about page
			.when('/paciente_ingreso_previo_adultos', {
				templateUrl : 'paciente_ingreso_previo_adultos.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/paciente_ingreso_previo_pediatricos', {
				templateUrl : 'paciente_ingreso_previo_pediatricos.html',
				controller  : 'contactController'
			})
			.when('/ingreso_form', {
				templateUrl : 'ingreso_form.html',
//				controller  : 'contactController'
			});
		
	});

	// create the controller and inject Angular's $scope
	triageApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});

	triageApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	triageApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});