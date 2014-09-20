describe('Test pantalla de ingreso de sintomas', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA, y el usuario admin/admin
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  //TEST BUSQUEDA DE SINTOMAS
  it('el titulo debe ser "Ingreso de síntomas"', function() {
    browser.get('http://localhost:8080/triage/');  
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    //me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes
    element(by.model('nombre')).sendKeys('nestor');//busco al paciente nestor
    element(by.id("botonBuscar")).click();
    browser.waitForAngular();
    element(by.buttonText('Ingresar')).click();
    browser.waitForAngular();

    element(by.id("cargaSintomas")).click();
    expect(browser.getTitle()).toBe('Ingreso de síntomas');    
  });

  it('filtro por sintoma',function(){
    element(by.id('sintoma')).sendKeys('d');//ingreso la letra d
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.buttonText('Agregar')).count()).toBe(2);//deben quedar dos botones 'Agregar' correspondientes a los sintomas “DOLOR SEVERO” y “DESHIDRATACION” 

    var celdasDelListado = $$('.ngCellText span');//encuentra las 4 celdas del listado filtrado
    expect(celdasDelListado.count()).toBe(4);
    expect(celdasDelListado.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
    expect(celdasDelListado.get(1).getText()).toBe('IMPRESION INICIAL');
    expect(celdasDelListado.get(2).getText()).toBe('DOLOR SEVERO (p1-p3)');
    expect(celdasDelListado.get(3).getText()).toBe('IMPRESION INICIAL');
    element(by.id('sintoma')).clear();//limpio el campo
  });

  it('filtro por discriminante',function(){
    element(by.id('discriminante')).sendKeys('dolor');//ingreso "dolor"
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element.all(by.buttonText('Agregar')).count()).toBe(1);//debe quedar un boton 'Agregar' correspondiente al sintoma “CONTRACTURA” 

    var celdasDelListado = $$('.ngCellText span');//encuentra las 2 celdas del listado filtrado
    expect(celdasDelListado.count()).toBe(2);
    expect(celdasDelListado.get(0).getText()).toBe('CONTRACTURA (p3-p2)');
    expect(celdasDelListado.get(1).getText()).toBe('DOLOR MUSCULAR');
    element(by.id('discriminante')).clear();//limpio el campo
  });

  it('filtro por sintoma incorrectamente',function(){
    element(by.id('sintoma')).sendKeys('    aaaaaaaaaaa');//ingreso '    aaaaaaaaaaa'
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();
    expect(element(by.buttonText('Agregar')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
    element(by.id('sintoma')).clear();//limpio el campo
  });

  //TEST CARGA DE SINTOMAS
  it('Cargo el sintoma DESHIDRATACION y CONTRACTURA',function(){
    var sintomaTextInput = element(by.id('sintoma'));
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
    expect(sintomasAgregados.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
    expect(sintomasAgregados.get(1).getText()).toBe('CONTRACTURA (p3-p2)');
    element(by.id('salir')).click();//presiono salir
  });

  it('Test visibilidad del boton borrar del sintoma cargado',function(){
    element(by.model('nombre')).sendKeys('marcia');//busco al paciente marcia
    element(by.id("botonBuscar")).click();
    browser.waitForAngular();
    element(by.buttonText('Ingresar')).click();
    browser.waitForAngular();

    element(by.id("cargaSintomas")).click();
    expect(browser.getTitle()).toBe('Ingreso de síntomas');

    //filtro el listado por el sintoma contractura
    element(by.id('sintoma')).sendKeys('contractura');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma contractura
    expect($('.animate-repeat .ng-hide').isPresent()).toBe(true);//el link borrar de ese sintoma esta presente y oculto

    var sintomaAgregado = element(by.binding('sintoma.nombre'));      
    browser.actions().mouseMove(sintomaAgregado.find()).perform();//poso el mouse sobre el sintoma agregado

    expect($('.animate-repeat .ng-hide').isPresent()).toBe(false);//como el elemento se muestra, no deberia encontrar nada de la clase .ng-hide
    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(1);
    element(by.id('sintoma')).clear();//limpio el campo
  });

  it('Test borrar sintoma cargado',function(){
    var sintomaAgregado = element(by.binding('sintoma.nombre'));    
    browser.actions().mouseMove(sintomaAgregado.find()).perform();//poso el mouse sobre el sintoma agregado
    element(by.id('borrar_0')).click();//presiono borrar    
    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(0);//los sintomas agregados deberian ser 0
  });

  it('El mismo sintoma no se puede agregar 2 veces',function(){
    //filtro el listado por el sintoma contractura
    element(by.id('sintoma')).sendKeys('contractura');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    element(by.buttonText('Agregar')).click();//cargo el sintoma contractura
    element(by.buttonText('Agregar')).click();//hago click nuevamente sobre el boton agregar

    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(1);//los sintomas agregados deberian ser 1
    element(by.id('sintoma')).clear();//limpio el campo
  });

  it('Cargo dos sintomas con exito',function(){
    var sintomaTextInput = element(by.id('sintoma'));

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

    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('Síntomas cargados con éxito');//aparece el mensaje de carga exitosa
    element(by.buttonText('OK')).click();//cargo el sintoma dolor severo
    browser.sleep(1000);
    sintomaTextInput.clear();//limpio el campo sintoma
  });

  it('Test pedido de confirmacion si se carga sintoma de prioridad uno',function(){
    //filtro el listado por el sintoma dolor severo
    element(by.id('sintoma')).sendKeys('dolor severo');
    element(by.id('buscar')).click();//presiono buscar
    browser.waitForAngular();

    expect($('.bootbox').isPresent()).toBe(false);//el pedido de confirmacion no exite

    element(by.buttonText('Agregar')).click();//cargo el sintoma dolor severo
    browser.waitForAngular();
    expect($('.bootbox').isPresent()).toBe(true);//aparece el pedido de confirmacion
  });

  it('Test cancelo la carga del sintoma de prioridad uno',function(){
    var botonCancelar = $$('.modal-footer button').get(0);
    botonCancelar.click();//no confirmo
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer    

    expect(browser.getTitle()).toBe('Ingreso de síntomas');//deberia seguir en la pantalla de ingreso de sintomas
    expect(element.all(by.repeater('sintoma in sintomas')).count()).toBe(2);//los sintomas agregados deberian ser 2
  });

  it('Test cargo y confirmo sintoma de prioridad uno',function(){
    element(by.buttonText('Agregar')).click();//cargo el sintoma dolor severo

    var botonOK = $$('.modal-footer button').get(1);
    botonOK.click();//confirmo
    browser.sleep(1000);

    expect(browser.getTitle()).toBe('PRIORIDAD 1');
    expect(element(by.id('nombreYApellido')).getText()).toBe('Nombre y apellido: MARCIA TEJEDA');
    //me deslogueo logout
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();
  });

});

