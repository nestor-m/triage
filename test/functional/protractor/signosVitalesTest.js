/*
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
*/

describe('Test pantalla de ingreso de signos vitales', function() {

  it('Chequeo que el titulo es Signos Vitales',function() {
      browser.get('http://localhost:8080/triage/');  
	  element(by.model('nombre')).sendKeys('admin');//me logueo con admin
      element(by.model('password')).sendKeys('admin');
      element(by.id("ingresar")).click();
      browser.waitForAngular();
      //me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes      
      element(by.model('nombre')).sendKeys('signos');
      element(by.model('apellido')).sendKeys('vitales');
      element(by.model('fechaDeNacimiento')).sendKeys('21/03/1987');
      element(by.id("botonIngresoPaciente")).click();
      browser.waitForAngular();
      element(by.id('signos_vitales')).click();;
      expect(browser.getTitle()).toBe('Signos Vitales');//chequeo el titulo
  });
  
  it('chequeo que los sintomas ingresados sean los mismos cuando vuelvo a la pantalla', function() {
	  
	  /*Método encontrado en internet para seleccionar items en un dropdown*/
	  var selectDropdownbyNum = function ( element, optionNum ) {
		    if (optionNum){
		      var options = element.findElements(by.tagName('option'))   
		        .then(function(options){
		          options[optionNum].click();
		        });
		    }
		  };
		  var selectPulso = selectDropdownbyNum(element(by.id('pulso')), 2);
		  var selectPresion = selectDropdownbyNum(element(by.id('sistole')), 2);
		  var selectTemperatura = selectDropdownbyNum(element(by.id('temperatura')), 2);
		  var selectFrecuencia = selectDropdownbyNum(element(by.id('frecuenciaRespiratoria')), 2);
		  browser.waitForAngular();	
		  //Salgo de la pantalla
		  element(by.buttonText('Aceptar')).click();
		  browser.waitForAngular();//espero a que se despliegue el modal
		  element(by.buttonText('OK')).click();//mensaje de carga exitosa
		  browser.sleep(1000);
		  expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado');
		  element(by.id('salir')).click();//salgo
		  browser.waitForAngular();		  
		  element(by.id('espera')).click();//voy al listado de pacientes en espera
		  browser.waitForAngular();	
		  element(by.model('nombre')).sendKeys('signos');//busco es paciente ingresado
		  element(by.id('botonBuscar')).click();
		  browser.waitForAngular();	
		  element(by.buttonText('Triage')).click();//vuelvo a la pantalla de triage
		  browser.waitForAngular();	
		  element(by.id('signos_vitales')).click();//vuelvo a la pantalla de signos vitales		  
		  //Yo sé qué elegí en cada opción...
		  expect(element(by.selectedOption('$parent.pulso')).getText()).toEqual('70');
		  expect(element(by.selectedOption('$parent.sistole')).getText()).toEqual('90');
		  expect(element(by.selectedOption('$parent.temperatura')).getText()).toEqual('35-37');
		  expect(element(by.selectedOption('$parent.frecuenciaRespiratoria')).getText()).toEqual('12-15');		  
  });
  
  
  it('TEST que temperatura 33 es p1', function(){
  	var selectDropdownbyNum = function ( element, optionNum ) {
	    if (optionNum){
	      var options = element.findElements(by.tagName('option'))   
	        .then(function(options){
	          options[optionNum].click();
	        });
	    }
	};

	browser.waitForAngular();
	expect($('.bootbox').isPresent()).toBe(false);//el pedido de confirmacion no exite
	//selecciono la temperatura en menos de 35
	var selectTemperatura = selectDropdownbyNum(element(by.id('temperatura')), 1);
	browser.waitForAngular();
	expect($('.bootbox').isPresent()).toBe(true);//aparece el pedido de confirmacion	  
	var botonOK = $$('.modal-footer button').get(1);
	botonOK.click();//confirmo
	browser.sleep(1000);
	expect(browser.getTitle()).toBe('PRIORIDAD 1');
	//me deslogueo logout
	element(by.id("dropdownUsuario")).click();
	element(by.id("logout")).click();
  });  
  
});

	