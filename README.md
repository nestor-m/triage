Triage
===

[![Build Status](https://travis-ci.org/nestor-m/triage.svg?branch=master)](https://travis-ci.org/nestor-m/triage)

Para Instalar Grails:

Seguir las instrucciones en:  http://www.youtube.com/watch?v=zshNRKytyFk

Requerimientos:
-Tener instalada una versión de Java 1.6 o mayor. Es necesario tener un JDK, ya que con el JRE no es suficiente.
-Tener seteada la variable de entorno JAVA_HOME apuntando a la ubicación de la instalación de java (pahtajava/bin)


Clonar la aplicación de GitHub desde: http://github.com/nestor-m/triage

Para compilar/correr la aplicación sin Eclipse:

-Ir al directorio donde se hizo la descarga de la aplicación.
-Desde la consola escribir "grails run-app"


Para correr las pruebas sin Eclipse:

Pruebas unitarias de Grails:

-Ir al directorio donde se hizo la descargar de la aplicación.
-Desde la consola escribir "grails test-app"

Pruebas funcionales con Casper:

-Ir al directorio donde se hizo la descarga de la aplicación.
-Ingresar en test/functional
-Correr cada test por separado utilizando Casper (casper test archivo.js)


Para instalar Casper:


Primero se instala Phantomjs: 
sudo tar xvf phantomjs-1.9.0-linux-x86_64.tar.bz2
sudo mv phantomjs-1.9.0-linux-x86_64 /usr/local/share/phantomjs
sudo ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/bin/phantomjs

(http://stackoverflow.com/questions/8778513/how-can-i-setup-run-phantomjs-on-ubuntu)

Y después Casper con npm:

$ npm install -g casperjs


INSTALACIÓN PROTRACTOR

1) Descargar jar de selenium de http://selenium-release.storage.googleapis.com/2.40/selenium-server-standalone-2.40.0.jar
2) Instalar protractor
	$npm install -g protractor
3) Crear archivo de configuracion y test como dice en https://github.com/angular/protractor
4) Descargar driver para chrome de http://chromedriver.storage.googleapis.com/2.9/chromedriver_linux32.zip
5) Descomprimirlo y agregar directorio al $PATH. Para hacerlo ejecutar
	$gedit ~/.profile	

  y donde diga PATH="$HOME/bin:$PATH" agregar el path al directorio, 
  ej PATH="$HOME/bin:$PATH:/path/al/directorio/del/archivo/descomprimido"
  (fuente: http://askubuntu.com/questions/141718/what-is-path-environment-variable-and-how-to-add-it)

6) Levantar selenium, ejecutar
 $java -jar selenium-server-standalone-2.40.0.jar
7) Ejecutar test
 $protractor myConf.js

fuente: https://github.com/angular/protractor
