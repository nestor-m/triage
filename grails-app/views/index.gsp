<!-- 
Copyright (C) 2015  Nestor Muñoz. nestorgabriel2008@gmail.com; Marcia Tejeda. tejedamarcia@gmail.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->

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
        <li><a id="espera" href="#pacientes_espera"><i class="fa fa-clock-o"></i> Espera</a></li>
        <li>          
            <a id="dropdownMenu1" data-toggle="dropdown" href=""><i class="fa fa-file-text-o"></i> Reportes</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                <li role="presentation"><a id="reporte_prioridades" role="menuitem" tabindex="-1" href="#reporte_prioridades">Prioridades</a></li>
                <li role="presentation"><a id="reporte_esperas" role="menuitem" tabindex="-1" href="#reporte_tiempo_espera">Tiempos de espera</a></li>
                <li role="presentation"><a id="busqueda_personas" role="menuitem" tabindex="-1" href="#busqueda_personas">B&uacute;squeda de personas</a></li>
                <li role="presentation"><a id="registro_diario" role="menuitem" tabindex="-1" href="#registro_diario">Registro diario</a></li>
              </ul>              
        </li>
        <li id='configuracion' ng-hide="usuario.rol.name!='ADMINISTRADOR'">          
            <a id="dropdownConfiguracion" data-toggle="dropdown" href=""><i class="fa fa-asterisk"></i>Configuraci&oacute;n</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownConfiguracion">
                <li role="presentation"><a id="sintomas" role="menuitem" tabindex="-1" href="#sintomas_list">S&iacute;ntomas</a></li>
                <li role="presentation"><a id="discriminantes" role="menuitem" tabindex="-1" href="#discriminantesListado">Discriminantes</a></li>
                <li role="presentation"><a id="usuarios" role="menuitem" tabindex="-1" href="#usuariosListado">Usuarios</a></li>
              </ul>              
        </li>
        <li>          
            <a id="dropdownUsuario" data-toggle="dropdown" href=""><i class="fa fa-user"></i> {{usuario.nombre}}</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownUsuario">
                <li role="presentation"><a id="cambiarPassword" role="menuitem" tabindex="-1" href="#cambiarPassword" >Cambiar contrase&ntilde;a</a></li>
                <li role="presentation"><a id="logout" role="menuitem" tabindex="-1" href="" ng-click="logout()">Salir</a></li>
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
    <a href="https://github.com/nestor-m/triage">Triage</a>  | v<g:meta name="app.version"/>
  </footer>
</body>

</html>

	
