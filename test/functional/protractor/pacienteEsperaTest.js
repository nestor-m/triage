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

describe('Test pantalla de pacientes en espera', function() {

	it('Chequeo titulo',function() {
	      browser.get('http://localhost:8080/triage/');  
	      element(by.model('nombre')).sendKeys('admin');//me logueo con admin
	      element(by.model('password')).sendKeys('admin');
	      element(by.id("ingresar")).click();
	      browser.waitForAngular();
	      element(by.model('nombre')).sendKeys('nestor');
	      element(by.id("botonBuscar")).click();
	      browser.waitForAngular();
	      element(by.buttonText('Ingresar')).click();
	      browser.waitForAngular();
	      expect(browser.getTitle()).toBe('Impresión Visual');//chequeo el titulo    
	  });
	
	/**
	 * Tenemos en cuenta para este test que hay un sólo Nestor y su apellido es Muñoz
	 */
	it('Chequeo que salgo de la pantalla del paciente, lo busco en la lista de espera y lo encuentro', function(){
		//se que ya estoy en la pantalla de impresion visual
		var nombre = element(by.binding('pacienteActual.nombre'));
	    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		element(by.buttonText('Salir')).click();
		browser.waitForAngular();
		element(by.id('espera')).click();
		browser.waitForAngular();
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.waitForAngular();
		element(by.buttonText('Triage')).click();
		var nombre = element(by.binding('pacienteActual.nombre'));
	    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado'); 
	});
	
	
	/**
	 * Tenemos en cuenta para este test que hay un sólo Nestor y su apellido es Muñoz
	 */
	it('Chequeo que finalizar paciente quite al paciente de la lista de espera', function(){
		element(by.buttonText('Salir')).click();
		browser.waitForAngular();
		element(by.id('espera')).click();
		browser.waitForAngular();
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.waitForAngular();
		
		element(by.buttonText('Finalizar')).click();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/finalizar_paciente');
		var nombre = element(by.binding('paciente.nombre'));
	    expect(nombre.getText()).toBe('Nombre y apellido: NESTOR MUÑOZ');
	    //clickeo en "Ingresa"
	    element.all(by.model('opciones')).get(0).click();
	    browser.waitForAngular();
	    element(by.buttonText('Finalizar')).click();
	    var botonOK = $$('.modal-footer button').get(1);
	    botonOK.click();//confirmo
	    browser.sleep(1000);
	    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/pacientes_espera');
	    //me deslogueo logout
    	element(by.id("dropdownUsuario")).click();
    	element(by.id("logout")).click();
	});
	
});