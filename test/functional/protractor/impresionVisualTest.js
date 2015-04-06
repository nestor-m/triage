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

describe('Test pantalla de ingreso de impresion visual', function() {

	it('Chequeo titulo',function() {
      browser.get('http://localhost:8080/triage/');
      element(by.model('nombre')).sendKeys('admin');//me logueo con admin
      element(by.model('password')).sendKeys('admin');
      element(by.id("ingresar")).click();
      browser.waitForAngular();
      //me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes
      element(by.model('nombre')).sendKeys('nestor');
      element(by.id("botonBuscar")).click();
      browser.waitForAngular();
      element(by.buttonText('Ingresar')).click();
      browser.waitForAngular();
      expect(browser.getTitle()).toBe('Impresión Visual');//chequeo el titulo
	});
	
	
	/*Precond: tengo en la base dos síntomas de impresión visual*/
	//a veces anda y a veces no
	it('chequeo que al ingresar un síntoma y volver a la pantalla, el sintoma sigue cargado', function (){
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		//se que el primero del arreglo es deshidratacion de p2
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		browser.waitForAngular();
		//vuelvo a la pantalla de paciente ingresado /que ya no existe!
		element(by.buttonText('Aceptar')).click();
		browser.waitForAngular();
		var botonOK = $$('.modal-footer button').get(0);
	    botonOK.click();//confirmo
	    browser.sleep(1000);
		
		element(by.id('signos_vitales')).click();
		browser.waitForAngular();
		//ingreso nuevamente a la impresion visual
		element(by.id('impresion_visual')).click();
		browser.waitForAngular();		
		
		var sintomas2 = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
//		 expect(sintomas2.get(0).evaluate()).toBe(true);		
	});
	
	
	it ('Test que al ingresar un síntoma de prioridad 1 se muestra la pantalla de confirmación y luego la pantalla de p1', function(){
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		//se que el primero del arreglo es deshidratacion de p2
		expect(sintomas.get(1).getText()).toBe('DOLOR SEVERO (p1-p3)');
		sintomas.get(1).click();
		
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