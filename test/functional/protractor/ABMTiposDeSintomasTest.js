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

describe('Test ABM de tipos de sintomas', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA, y el usuario admin/admin
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  function voyAlListadoDeDiscriminantes(){
    element(by.id("dropdownConfiguracion")).click();
    element(by.id("discriminantes")).click();
  }
  
  it('el titulo debe ser "Listado de discriminantes"', function() {
    browser.get('http://localhost:8080/triage/');
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();//me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes    
    voyAlListadoDeDiscriminantes();
    expect(browser.getTitle()).toBe('Listado de discriminantes');   
  });

  //TEST FILTRO
  it('filtro por discriminante',function(){
    element(by.model('tipoDeSintoma')).sendKeys('IMPRESION');
    element(by.id("buscar")).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(1);//deben quedar un boton 'Ver detalle' correspondiente a IMPRESION INICIAL
    element(by.model('tipoDeSintoma')).clear();
  });

  it('filtro por discriminante incorrectamente',function(){
    element(by.model('tipoDeSintoma')).sendKeys('    aaaaaaaaaaa');//ingreso '    aaaaaaaaaaa'
    element(by.id("buscar")).click();//presiono buscar
    browser.waitForAngular();
    expect(element(by.id('verDetalle')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
    element(by.model('tipoDeSintoma')).clear();
  });

  //TEST DETALLE DE DISCRIMINANTES
  it('Detalle del discrimiante IMPRESION INICIAL',function(){//Nota: el discriminante IMPRESION INICIAL es al unico que no se puede modificar el nombre
    element(by.model('tipoDeSintoma')).sendKeys('impresion inicial');//filtro el listado
    element(by.id("buscar")).click();//presiono buscar
    browser.waitForAngular();

    element(by.id('verDetalle')).click();
    browser.waitForAngular();

    expect(browser.getTitle()).toBe('Formulario de discriminante');//chequeo que estoy en el formulario de discriminante

    //chequeo que este el nombre del discriminante cargado    
    var inputNombre = element(by.model('tipoDeSintoma.nombre'));
    expect(inputNombre.getAttribute('value')).toEqual('IMPRESION INICIAL');//This is a webdriver quirk. <input> and <textarea> elements always have empty getText values. Instead, try element.getAttribute('value').
    expect(inputNombre.isEnabled()).toBe(false);
    expect(element.all(by.id('verDetalle')).count()).toBe(2);//dos botones Ver Detalle de los sintomas DOLOR SEVERO Y DESHIDRATACION
  });

  it('Nuevo discriminante',function(){    
    voyAlListadoDeDiscriminantes();
    element(by.id('nuevo')).click();

    expect(browser.getTitle()).toBe('Formulario de discriminante');//chequeo que estoy en el formulario de discriminante
    expect(element(by.id('listado')).isDisplayed()).toBe(false);//el listado de sintomas debe estar oculto
    expect(element(by.id('aceptar')).isEnabled()).toBe(false);//el boton aceptar no tiene q estar habilitado

    element(by.model('tipoDeSintoma.nombre')).sendKeys('un nuevo discriminante');
    browser.waitForAngular();

    element(by.id('aceptar')).click();//presiono aceptar
    browser.waitForAngular();
    expect($('.bootbox').isPresent()).toBe(true);//aparece el mensaje de discriminante cargado con exito
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);

    voyAlListadoDeDiscriminantes();
    //filtro el listado
    element(by.model('tipoDeSintoma')).sendKeys('un nuevo discriminante');
    element(by.id("buscar")).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(1)

    //voy hacia el formulario de sintoma y me deberia aparecer el nuevo tipo de sintoma entre las opciones
    element(by.id("dropdownConfiguracion")).click();
    element(by.id("sintomas")).click();
    browser.waitForAngular();
    element(by.id('nuevo')).click();
    expect(element.all(by.css('select[id="discriminante"] option')).count()).toBe(4);//tiene que aparecer el nuevo tipo de sintoma disponible
    //me deslogueo logout
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();
  });

});

