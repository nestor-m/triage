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
  Los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA y los usuarios ADMIN (con rol ADMINISTRADOR) y USER (con rol USUARIO)
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  beforeEach(function() {
      browser.get('http://localhost:8080/triage/');
  });

  function logout(){
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();//me deslogueo
    browser.waitForAngular();
  }
  
  it('Login exitoso', function() {
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(browser.getTitle()).toBe('Búsqueda e ingreso de pacientes');
    logout();   
  });

  it('Login fallido, ingreso mal la password',function(){
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('adminn');//ingreso password incorrecta
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(element(by.id("mensajeError")).isDisplayed()).toBe(true);//se debe mostrar el mensaje de error
    element(by.model('nombre')).clear();//limpio el formulario
    element(by.model('password')).clear();
  });

  it('Logout exitoso',function(){
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    //me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes    
    logout();
    expect(browser.getTitle()).toBe('Login');//deberia dirigirme a la pantalla de login
  });

  it('Ingresar a una pagina de la aplicacion distinta a la de login sin haberme logueado',function(){
    browser.get('http://localhost:8080/triage/#/busqueda_ingreso_paciente');//voy hacia la pantalla de ingreso y busqueda de pacientes
    element(by.model('nombre')).sendKeys('nestor');
    element(by.id('botonBuscar')).click();//intento buscar un paciente
    browser.waitForAngular();
    expect(browser.getTitle()).toBe('Login');//deberia dirigirme a la pantalla de login
  });

  it('Login administrador',function(){
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(element(by.id("configuracion")).isDisplayed()).toBe(true);//*configuracion debe aparecer en el menu
    logout();
  });

  it('Login no administrador',function(){
    element(by.model('nombre')).sendKeys('user');//me logueo con usuario no administrador
    element(by.model('password')).sendKeys('user');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(element(by.id("configuracion")).isDisplayed()).toBe(false);//*configuracion no debe aparecer en el menu
    logout();
  });

});

