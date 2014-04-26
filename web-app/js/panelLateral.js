var app = angular.module('panelLateral', [ 'ngRoute', 'ngGrid', 'checklist-model',
		'ngCookies', 'ngDropdowns' ]);

app.config(function($routeProvider) {
	$routeProvider

	.when('/impresion_visual', {
		templateUrl : 'impresion_visual.html',
		controller : 'impresionVisualController'
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