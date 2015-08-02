Triage
===

[![Build Status](https://travis-ci.org/nestor-m/triage.svg?branch=master)](https://travis-ci.org/nestor-m/triage)

Esta aplicación fue desarrollada originalmente por Néstor Munoz y Marcia Tejeda como trabajo final de su carrera de Técnicos en Programación Informática en la Universidad Nacional de Quilmes. 
Esta aplicación implementa el modelo de Triage diseñado por el equipo del Doctor Luis Reggiani en el Hospital Oñativia de Rafael Calzada, partido de Almirante Brown en Argentina. 
En la carpeta _doc_ se encuentra el informe completo de este trabajo, el mismo brinda más detalles tanto del contexto del proyecto como también cuestiones técnicas de diseño e implementación.

## Primeros pasos

* Para compilar/correr _grails run-app_
* Para correr las pruebas grails _grails test-app_
* Para correr las pruebas casper _casperjs test test/functional/casper_
* Para correr las protractor _protractor test/functional/protractor/myConf.js_


## Instalación

### Prerequisitos

* Tener instalada una versión de Java 1.6 o mayor. Es necesario tener un JDK, ya que con el JRE no es suficiente.
* Tener seteada la variable de entorno JAVA_HOME apuntando a la ubicación de la instalación de java (path_a_java/bin)

### Instalación Grails

Seguir las instrucciones de [este video](http://www.youtube.com/watch?v=zshNRKytyFk)


### Instalación Casperjs

Primero se instala Phantomjs: 
sudo tar xvf phantomjs-1.9.0-linux-x86_64.tar.bz2
sudo mv phantomjs-1.9.0-linux-x86_64 /usr/local/share/phantomjs
sudo ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/bin/phantomjs

(http://stackoverflow.com/questions/8778513/how-can-i-setup-run-phantomjs-on-ubuntu)

Y después Casper con npm:

$ npm install -g casperjs


### Instalación Protractor

1. Descargar jar de selenium de http://selenium-release.storage.googleapis.com/2.40/selenium-server-standalone-2.40.0.jar
2. Instalar protractor
	$npm install -g protractor
3. Crear archivo de configuracion y test como dice en https://github.com/angular/protractor
4. Descargar driver para chrome de http://chromedriver.storage.googleapis.com/2.9/chromedriver_linux32.zip
5. Descomprimirlo y agregar directorio al $PATH. Para hacerlo ejecutar
	$gedit ~/.profile	y donde diga PATH="$HOME/bin:$PATH" agregar el path al directorio, 
  ej PATH="$HOME/bin:$PATH:/path/al/directorio/del/archivo/descomprimido"
  (fuente: http://askubuntu.com/questions/141718/what-is-path-environment-variable-and-how-to-add-it)

6. Levantar selenium, ejecutar
 $java -jar selenium-server-standalone-2.40.0.jar
7.  Ejecutar test
 $protractor myConf.js

Fuente: [https://github.com/angular/protractor](https://github.com/angular/protractor)
