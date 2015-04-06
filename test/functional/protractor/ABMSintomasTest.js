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

describe('Test ABM de sintomas', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Y los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  function voyAlListadoDeSintomas(){
    element(by.id("dropdownConfiguracion")).click();
    element(by.id("sintomas")).click();
  }
  
  it('el titulo debe ser "Listado de síntomas"', function() {
    browser.get('http://localhost:8080/triage/');
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    //me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes    
    voyAlListadoDeSintomas();
    expect(browser.getTitle()).toBe('Listado de síntomas');   
  });

  //TEST FILTRO
  it('filtro por sintoma',function(){
    element(by.id('sintoma')).sendKeys('d');//ingreso la letra d
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(2);//deben quedar dos botones 'Ver detalle' correspondientes a los sintomas “DOLOR SEVERO” y “DESHIDRATACION” 
    element(by.id('sintoma')).clear();
  });

  it('filtro por discriminante',function(){
    element(by.id('tipoDeSintoma')).sendKeys('dolor');//ingreso "dolor"
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(1);//debe quedar un boton 'Ver detalle' correspondiente al sintoma “CONTRACTURA” 
    element(by.id('tipoDeSintoma')).clear();
  });

  it('filtro por sintoma incorrectamente',function(){
    element(by.id('sintoma')).sendKeys('    aaaaaaaaaaa');//ingreso '    aaaaaaaaaaa'
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element(by.id('verDetalle')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
    element(by.id('sintoma')).clear();
  });

  //TEST DETALLE DE SINTOMAS
  it('Detalle del sintoma DOLOR SEVERO',function(){
    element(by.id('sintoma')).sendKeys('dolor severo');//filtro el listado
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.id('verDetalle')).click();
    browser.waitForAngular();

    expect(browser.getTitle()).toBe('Formulario de síntomas');//chequeo que estoy en el formulario de sintomas

    //chequeo que esten todos los valores del sintoma DOLOR SEVERO cargados
    
    expect(element(by.selectedOption('sintoma.tipoDeSintoma')).getText()).toEqual('IMPRESION INICIAL');
    expect(element(by.selectedOption('sintoma.prioridadAdulto')).getText()).toEqual('UNO');
    expect(element(by.selectedOption('sintoma.prioridadPediatrico')).getText()).toEqual('TRES');
    expect(element(by.model('sintoma.nombre')).getAttribute('value')).toEqual('DOLOR SEVERO (p1-p3)');//This is a webdriver quirk. <input> and <textarea> elements always have empty getText values. Instead, try element.getAttribute('value').
  });

  it('Nuevo sintoma',function(){    
    voyAlListadoDeSintomas();
    element(by.id('nuevo')).click();

    expect(browser.getTitle()).toBe('Formulario de síntomas');//chequeo que estoy en el formulario de sintomas

    element(by.id('nombre')).sendKeys('un nuevo sintoma');
    element.all(by.css('select[id="discriminante"] option')).get(2).click();//selecciono la opcion 2 del select
    element(by.select("sintoma.prioridadAdulto")).click();
    element(by.id('prioridadAdultoUno')).click();

    //antes de llenar todo el formulario el boton aceptar deberia estar deshabilitado
    expect(element(by.id('aceptar')).isEnabled()).toBe(false);

    //termino de llenar el formulario
    element(by.select("sintoma.prioridadPediatrico")).click();
    element(by.id('prioridadPediatricoDos')).click();

    element(by.id('aceptar')).click();
    browser.waitForAngular();
    expect($('.bootbox').isPresent()).toBe(true);//aparece el mensaje de sintoma cargado con exito
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);

    voyAlListadoDeSintomas();

    //filtro el listado
    element(by.id('sintoma')).sendKeys('un nuevo sintoma');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(1)
    //me deslogueo logout
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();
  });

});

