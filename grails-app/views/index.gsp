<!DOCTYPE html>

<!-- define angular app -->
<html ng-app="triageApp">

<head>
  <!-- SCROLLS -->
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css" />

  <!-- SPELLS -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular-route.js"></script>
  <script src="js/script.js"></script>
<%--  <script src="js/application.js"></script>--%>
</head>

<!-- define angular controller -->
<body> 
<%-- ng-controller="mainController">--%>

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

	
