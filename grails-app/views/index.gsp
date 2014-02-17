<!DOCTYPE html>

<!-- define angular app -->
<html ng-app="triageApp">

<head>
<!--NOTA: para correr tests funcionales de Grails comentar los js de jquery y bootstrap 
    y a los scripts locales	agregarles /static adelante, ej: 
	reemplazar:
		<script src="js/script.js"></script>
	por:
		<script src="static/js/script.js"></script> 
	--> 

  <!-- SCROLLS -->
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css" />
  
  <!-- SPELLS -->
<%--  comentar los js de jquery y bootstrap para correr los tets funcionales de Grails--%>
  <%-- <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script> --%> 
<%--  <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>--%>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular-route.js"></script>


  <%--BOOTSTRAP LOCAL--%>
<%--  <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">--%>
<%--  <script src="static/bootstrap/js/bootstrap.min.js"></script>--%>
  
  <%--ANGULARJS LOCAL--%>
<%--  <script src="js/angular.js"></script>--%>
<%--  <script src="js/route.js"></script>--%>


<%--ANGULARJS APP--%>
<%-- <script src="js/script.js"></script>--%>
  <script src="static/js/script.js"></script> <%--descomentar linea para correr tests funcionales de grails --%>
</head>
<body> 


  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Hospital Oñativia</a>
      </div>

      <ul class="nav navbar-nav navbar-right">
        <li><a href="#"><i class="fa fa-home"></i> Inicio</a></li>
        <li><a href="#datos_maestros"><i class="fa fa-shield"></i> Datos Maestros</a></li>
        <li><a href="#reportes"><i class="fa fa-comment"></i> Estadísticas</a></li>
      </ul>
    </div>
  </nav>

  <div id="main">
  
    <!-- angular templating -->
		<!-- this is where content will be injected -->
    <div data-ng-view></div>
    
  </div>
  
  <footer class="text-center">
    TIP Muñoz-Tejeda
  </footer>
</body>

</html>

	
