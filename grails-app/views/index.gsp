<!DOCTYPE html>

<!-- define angular app -->
<html ng-app="app"  lang="es">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>
  <!-- SCROLLS -->
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css" />
  
  <link rel="stylesheet" type="text/css" href="css/ng-grid.css" /> 
  <link rel="stylesheet" href="css/style.css"/> 
  
  <!-- SPELLS -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
<%--  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.min.js"></script>--%>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular-route.js"></script>
  
  <script type="text/javascript" src="lib/angular.js"></script>
  <script type="text/javascript" src="lib/jquery-1.9.1.js"></script>  
  <script type="text/javascript" src="lib/ng-grid-2.0.7.min.js"></script>
   <script type="text/javascript" src="lib/checklist-model.js"></script>
   <script type="text/javascript" src="lib/bootbox.min.js"></script>
   
  
  
  <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular-cookies.js"></script>

  <%--BOOTSTRAP LOCAL--%>
<%--  <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">--%>
<%--  <script src="bootstrap/js/bootstrap.min.js"></script>--%>


<%--ANGULARJS APP--%>
 <script src="js/app.js"></script>
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

	
