describe('Test pantalla de búsqueda e ingreso de pacientes', function() {

  /*PRECONDICION: hay solamente dos pacientes en el listado: NESTOR MUÑOZ y MARCIA TEJEDA. Si se ingresan nuevos pacientes
  es probable que los test dejen de funcionar*/

  beforeEach(function() {
      browser.get('http://localhost:8080/triage/');  
  });

  it('el titulo debe ser "Búsqueda e ingreso de pacientes"', function() {
    expect($$('.page-header h4').get(0).getText()).toBe('Búsqueda e ingreso de pacientes');    
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
  });

  it('si ingreso "aa" en "nombre" y presiono "buscar", deberia arrojar cero filas', function() {
  	element(by.model('nombre')).sendKeys('aa');
  	element(by.id('botonBuscar')).click();//buscar
    browser.waitForAngular();
    expect(element(by.buttonText('Ingresar')).isPresent()).toBe(false);//no encuentro ningun boton en el listado, es decir, el listado no arrojo ningun resultado
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
  });
});

