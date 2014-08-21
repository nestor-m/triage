describe('Test ABM de tipos de sintomas', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Y los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  beforeEach(function() {
      browser.get('http://localhost:8080/triage/');
      element(by.id("dropdownMenu1")).click();
      element(by.id("discriminantes")).click();
  });
  
  it('el titulo debe ser "Listado de discriminantes"', function() {
    expect(browser.getTitle()).toBe('Listado de discriminantes');   
  });

  //TEST FILTRO
  it('filtro por discriminante',function(){
    element(by.model('tipoDeSintoma')).sendKeys('IMPRESION');
    $('.page-header').click();//hago click en otro elemento para sacarle el foco
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(1);//deben quedar un boton 'Ver detalle' correspondiente a IMPRESION INICIAL
  });

  it('filtro por discriminante incorrectamente',function(){
    element(by.model('tipoDeSintoma')).sendKeys('    aaaaaaaaaaa');//ingreso '    aaaaaaaaaaa'
    $('.page-header').click();//hago click en otro elemento para sacarle el foco
    browser.waitForAngular();
    expect(element(by.id('verDetalle')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
  });

  //TEST DETALLE DE DISCRIMINANTES
  it('Detalle del discrimiante IMPRESION INICIAL',function(){//Nota: el discriminante IMPRESION INICIAL es al unico que no se puede modificar el nombre
    element(by.model('tipoDeSintoma')).sendKeys('impresion inicial');//filtro el listado
    $('.page-header').click();//hago click en otro elemento para sacarle el foco
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
    browser.waitForAngular();

    //voy hacia el listado de sintomas
    element(by.id("dropdownMenu1")).click();
    element(by.id("discriminantes")).click();
    //filtro el listado
    element(by.model('tipoDeSintoma')).sendKeys('un nuevo discriminante');
    $('.page-header').click();//hago click en otro elemento para sacarle el foco
    browser.waitForAngular();
    expect(element.all(by.id('verDetalle')).count()).toBe(1)

    //voy hacia el formulario de sintoma y me deberia aparecer el nuevo tipo de sintoma entre las opciones
    element(by.id("dropdownMenu1")).click();
    element(by.id("sintomas")).click();
    browser.waitForAngular();
    element(by.id('nuevo')).click();
    expect(element.all(by.css('select[id="discriminante"] option')).count()).toBe(4);//tiene que aparecer el nuevo tipo de sintoma disponible
  });

});

