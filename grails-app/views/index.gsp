<!DOCTYPE html>

<!-- define angular app -->
<html ng-app="app"  lang="es">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>
  <!-- <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css"/> -->
  <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css" /> <!-- a este no me lo puedo bajar xq tiene referencias a otras cosas de internet -->

  <link rel="stylesheet" type="text/css" href="css/ng-grid.css" />
  <link rel="stylesheet" type="text/css" href="css/dropdown.css" />
  <link rel="stylesheet" type="text/css" href="css/normalize.css" />
  <link rel="stylesheet" type="text/css" href="css/page.css" />      
  <link rel="stylesheet" href="css/style.css"/> 
  
  <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
  <script src="lib/jquery-2.0.3.min.js"></script>
  <script src="lib/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="lib/jquery.ui.datepicker-es.js"></script>
  <link rel="stylesheet" href="css/jquery-ui-1.10.4.custom.min.css"/>
  <!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>-->
  <script src="bootstrap/js/bootstrap-3.0.0.min.js"></script>

  
  <script type="text/javascript" src="lib/angular-1.2.15.js"></script>
  <script type="text/javascript" src="lib/ng-grid-2.0.7.min.js"></script>
  <script type="text/javascript" src="lib/checklist-model.js"></script>
  <script type="text/javascript" src="lib/bootbox.min.js"></script>
  <script type="text/javascript" src="lib/angular-dropdowns.js"></script>

  <!--<script src="http://silviomoreto.github.io/bootstrap-select/javascripts/bootstrap-select.js"></script>-->
  <script src="bootstrap/js/bootstrap-select-1.3.7.js"></script>
  <!--<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular-route.js"></script>-->
  <script src="lib/angular-route-1.2.10.js"></script>
  <!--<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular-cookies.js"></script>-->
  <script src="lib/angular-cookies-1.0.6.js"></script>

  <%--APP--%>
  <script src="js/app.js"></script>

</head>
<body ng-controller="indexController"> 

  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand">Triage - Hospital Oñativia</a>
      </div>


      <ul class="nav navbar-nav navbar-right" ng-hide="usuario==null">
        <li><a id="inicio" href="#busqueda_ingreso_paciente"><i class="fa fa-home"></i> Inicio</a></li>
        %{-- <li><a id="reporte_prioridades" href="#reporte_prioridades"><i class="fa fa-shield"></i> Reportes </a></li>
        <li><a id="reporte_esperas" href="#reporte_tiempo_espera"><i class="fa fa-comment"></i> Reportes II</a></li> --}%
        <li>          
            <a id="dropdownMenu1" data-toggle="dropdown" href=""><i class="fa fa-asterisk"></i> Reportes</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                <li role="presentation"><a id="reporte_prioridades" role="menuitem" tabindex="-1" href="#reporte_prioridades">Prioridades</a></li>
                <li role="presentation"><a id="reporte_esperas" role="menuitem" tabindex="-1" href="#reporte_tiempo_espera">Tiempos de espera</a></li>
                 <li role="presentation"><a id="busqueda_personas" role="menuitem" tabindex="-1" href="#busqueda_personas">B&uacute;squeda de personas</a></li>
              </ul>              
        </li>
        <li ng-hide="usuario.rol.name!='ADMINISTRADOR'">          
            <a id="dropdownMenu1" data-toggle="dropdown" href=""><i class="fa fa-asterisk"></i>Configuraci&oacute;n</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                <li role="presentation"><a id="sintomas" role="menuitem" tabindex="-1" href="#sintomas_list">S&iacute;ntomas</a></li>
                <li role="presentation"><a id="discriminantes" role="menuitem" tabindex="-1" href="#discriminantesListado">Discriminantes</a></li>
              </ul>              
        </li>
        <li>          
            <a id="dropdownMenu2" data-toggle="dropdown" href="">{{usuario.nombre}}</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2">
                <li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-click="logout()">Salir</a></li>
              </ul>              
        </li>

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

	
