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

describe('Test pantalla de búsqueda e ingreso de pacientes', function() {

  /*PRECONDICION: hay solamente dos pacientes en el listado: NESTOR MUÑOZ y MARCIA TEJEDA. 
  existe el usuario admin/admin
  Si se ingresan nuevos pacientes
  es probable que los test dejen de funcionar*/

  it('el titulo debe ser "Búsqueda e ingreso de pacientes"', function() {
    browser.get('http://localhost:8080/triage/');  
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();//me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes
    expect(element(by.tagName('h4')).getText()).toBe('Búsqueda e ingreso de pacientes');    
  });

  it('el boton "buscar" deberia estar desabilitado y el listado vacio', function() {
    var botonBuscar = element(by.id('botonBuscar'));
    expect(botonBuscar.isEnabled()).toBe(false);
    expect(element(by.buttonText('Ingresar')).isPresent()).toBe(false);//no encuentro ningun boton en el listado
  });

  it('si ingreso "n" en "nombre" y presiono "buscar", deberia filtrar la fila de NESTOR MUÑOZ', function() {
  	element(by.model('nombre')).sendKeys('n');
  	element(by.id('botonBuscar')).click();//buscar
    browser.waitForAngular();
    element.all(by.buttonText('Ingresar')).then(function(items){
    	expect(items.length).toBe(1);
    });
    element(by.model('nombre')).clear();
  });

  it('si ingreso "aa" en "nombre" y presiono "buscar", deberia arrojar cero filas', function() {
  	element(by.model('nombre')).sendKeys('aa');
  	element(by.id('botonBuscar')).click();//buscar
    browser.waitForAngular();
    expect(element(by.buttonText('Ingresar')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
    element(by.model('nombre')).clear();
  });

  it('si filtro por "nestor" y hago click sobre el boton Ingresar el paciente ingresado debe ser NESTOR MUÑOZ', function() {
  	element(by.model('nombre')).sendKeys('nestor');
    element(by.buttonText('Buscar')).click();
    browser.waitForAngular();
    element(by.buttonText('Ingresar')).click();
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado');
    var nombre = element(by.binding('pacienteActual.nombre'));
    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
    //me deslogueo logout
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();
  });
});

