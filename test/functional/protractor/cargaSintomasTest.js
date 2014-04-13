describe('Test pantalla de ingreso de sintomas', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Y los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  beforeEach(function() {
      browser.get('http://localhost:8080/triage/');  
      element(by.model('nombre')).sendKeys('nestor');
      element(by.id("botonBuscar")).click();
      browser.waitForAngular();
      element(by.buttonText('Ingresar')).click();
      browser.waitForAngular();

      element(by.id("cargaSintomas")).click();
  });

  //TEST BUSQUEDA DE SINTOMAS
  it('el titulo debe ser "Ingreso de síntomas"', function() {
    expect(browser.getTitle()).toBe('Ingreso de síntomas');    
  });

  it('filtro por sintoma',function(){
    element(by.model('sintoma')).sendKeys('d');//ingreso la letra d
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.buttonText('Agregar')).count()).toBe(2);//deben quedar dos botones 'Agregar' correspondientes a los sintomas “DOLOR SEVERO” y “DESHIDRATACION” 

    var celdasDelListado = $$('.ngCellText span');//encuentra las 4 celdas del listado filtrado
    expect(celdasDelListado.count()).toBe(4);
    expect(celdasDelListado.get(0).getText()).toBe('DESHIDRATACION (p2)');
    expect(celdasDelListado.get(1).getText()).toBe('IMPRESION INICIAL');
    expect(celdasDelListado.get(2).getText()).toBe('DOLOR SEVERO (p1)');
    expect(celdasDelListado.get(3).getText()).toBe('IMPRESION INICIAL');
  });

  it('filtro por discriminante',function(){
    element(by.model('discriminante')).sendKeys('dolor');//ingreso "dolor"
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.buttonText('Agregar')).count()).toBe(1);//debe quedar un boton 'Agregar' correspondiente al sintoma “CONTRACTURA” 

    var celdasDelListado = $$('.ngCellText span');//encuentra las 2 celdas del listado filtrado
    expect(celdasDelListado.count()).toBe(2);
    expect(celdasDelListado.get(0).getText()).toBe('CONTRACTURA (p3)');
    expect(celdasDelListado.get(1).getText()).toBe('DOLOR MUSCULAR');
  });

  it('filtro por sintoma incorrectamente',function(){
    element(by.model('sintoma')).sendKeys('    aaaaaaaaaaa');//ingreso '    aaaaaaaaaaa'
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element(by.buttonText('Agregar')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
  });

  //TEST CARGA DE SINTOMAS
  it('Cargo el sintoma DESHIDRATACION y CONTRACTURA',function(){
    var sintomaTextInput = element(by.model('sintoma'));
    //filtro el listado por el sintoma deshidratacion
    sintomaTextInput.sendKeys('deshidratacion');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma deshidratacion


    //filtro el listado por el sintoma contractura
    sintomaTextInput.clear();//limpio el campo sintoma
    sintomaTextInput.sendKeys('contractura');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma contractura

    var sintomasAgregados = element.all(by.repeater('sintoma in sintomas'));
    expect(sintomasAgregados.count()).toBe(2);
    expect(sintomasAgregados.get(0).getText()).toBe('DESHIDRATACION (p2)');
    expect(sintomasAgregados.get(1).getText()).toBe('CONTRACTURA (p3)');
  });

  it('Test visibilidad del boton borrar del sintoma cargado',function(){
    //filtro el listado por el sintoma contractura
    element(by.model('sintoma')).sendKeys('contractura');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma contractura
    expect($('.animate-repeat .ng-hide').isPresent()).toBe(true);//el link borrar de ese sintoma esta presente y oculto

    var sintomaAgregado = element(by.binding('sintoma.nombre'));      
    browser.actions().mouseMove(sintomaAgregado.find()).perform();//poso el mouse sobre el sintoma agregado

    expect($('.animate-repeat .ng-hide').isPresent()).toBe(false);//como el elemento se muestra, no deberia encontrar nada de la clase .ng-hide
  });

  it('Test borrar sintoma cargado',function(){
    //filtro el listado por el sintoma deshidratacion
    element(by.model('sintoma')).sendKeys('deshidratacion');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma deshidratacion
    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(1);//los sintomas agregados deberian ser 1

    var sintomaAgregado = element(by.binding('sintoma.nombre'));    
    browser.actions().mouseMove(sintomaAgregado.find()).perform();//poso el mouse sobre el sintoma agregado
    element(by.id('borrar_0')).click();//presiono borrar    
    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(0);//los sintomas agregados deberian ser 0
  });

  it('El mismo sintoma no se puede agregar 2 veces',function(){
    //filtro el listado por el sintoma contractura
    element(by.model('sintoma')).sendKeys('contractura');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma contractura
    element(by.buttonText('Agregar')).click();//hago click nuevamente sobre el boton agregar

    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(1);//los sintomas agregados deberian ser 1
  });

  it('Cargo dos sintomas con exito',function(){
    var sintomaTextInput = element(by.model('sintoma'));

    //filtro el listado por el sintoma deshidratacion
    sintomaTextInput.sendKeys('deshidratacion');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma deshidratacion

    //filtro el listado por el sintoma contractura
    sintomaTextInput.clear();//limpio el campo sintoma
    sintomaTextInput.sendKeys('contractura');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma contractura

    element(by.id('botonAceptar')).click();//presiono Aceptar
    browser.waitForAngular();

    expect(browser.getTitle()).toBe('Paciente ingresado');
  });

  it('Test pedido de confirmacion si se carga sintoma de prioridad uno',function(){
    //filtro el listado por el sintoma dolor severo
    element(by.model('sintoma')).sendKeys('dolor severo');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    expect($('.bootbox').isPresent()).toBe(false);//el pedido de confirmacion no exite

    element(by.buttonText('Agregar')).click();//cargo el sintoma dolor severo

    expect($('.bootbox').isPresent()).toBe(true);//aparece el pedido de confirmacion
  });

  it('Test cancelo la carga del sintoma de prioridad uno',function(){
    //filtro el listado por el sintoma dolor severo
    element(by.model('sintoma')).sendKeys('dolor severo');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma dolor severo

    var botonCancelar = $$('.modal-footer button').get(0);
    botonCancelar.click();//no confirmo

    expect(browser.getTitle()).toBe('Ingreso de síntomas');//deberia seguir en la pantalla de ingreso de sintomas
    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(0);//los sintomas agregados deberian ser 0
  });

  it('Test cargo y confirmo sintoma de prioridad uno',function(){
    //filtro el listado por el sintoma dolor severo
    element(by.model('sintoma')).sendKeys('dolor severo');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma dolor severo

    var botonOK = $$('.modal-footer button').get(1);
    botonOK.click();//confirmo
    browser.waitForAngular();

    expect(browser.getTitle()).toBe('PRIORIDAD 1');
    expect(element(by.id('nombreYApellido')).getText()).toBe('Nombre y apellido: NESTOR MUÑOZ');
  });

});

