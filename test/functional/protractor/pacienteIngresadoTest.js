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

describe('Test pantalla paciente ingresado', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA y los usuarios ADMIN (con rol ADMINISTRADOR) y USER (con rol USUARIO)
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/
	
  it('Chequeo el titulo',function() {
  	//ingreso el paciente Nestor Muñoz
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
  
  it('Navego desde impresión visual a carga de síntomas', function() {
  	element(by.id("cargaSintomas")).click();//presiono boton sintomas
  	browser.waitForAngular();  	
  	expect(browser.getTitle()).toBe('Ingreso de síntomas');//chequeo el titulo
  });
  
  it('Navego desde carga de síntomas a impresión visual', function() {
  	element(by.id("impresion_visual")).click();//presiono boton impresion visual
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Impresión Visual');//chequeo el titulo
  }); 

  it('Navego desde carga de signos vitales a impresión visual', function() {
  	element(by.id("signos_vitales")).click();//presiono boton signos vitales
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Signos Vitales');//chequeo el titulo
  	element(by.id("impresion_visual")).click();//presiono boton impresion visual
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Impresión Visual');//chequeo el titulo
  });   

  it('Me quedo en la misma pantalla', function() {
  	var botonImpresionVisual = element(by.id('impresion_visual'));
  	expect(botonImpresionVisual.isEnabled()).toBe(false);
  }); 
  
  it('Salgo de la pantalla paciente ingresado', function() {
  	element(by.id('salir')).click();//presiono el boton Salir
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Búsqueda e ingreso de pacientes');//chequeo el titulo
  });

  it('Finalizar triage', function() {
    element(by.id('espera')).click();
    browser.waitForAngular();
    //element(by.model('nombre')).sendKeys('nestor');
    //element(by.id("botonBuscar")).click();
    //browser.waitForAngular();
    element(by.buttonText('Triage')).click();
    browser.waitForAngular();
  	element(by.id('finalizarTriage')).click();//presiono el boton Finalizar Triage
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('PRIORIDAD 3');//chequeo el titulo
    expect(element(by.id("nombreYApellido")).getText()).toBe("Nombre y apellido: NESTOR MUÑOZ");
    //me deslogueo logout
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();
  }); 
  
});

	