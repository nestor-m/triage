describe('Test pantalla de búsqueda de pacientes', function() {

  it('el titulo debe ser "Búsqueda de pacientes"', function() {
    browser.get('http://localhost:8080/triage/#/busqueda');

    browser.sleep(500);

    expect($$('.page-header h3').get(0).getText()).toBe('Búsqueda de pacientes');    
  });

  /*Precondicion: hay solamente dos pacientes en el listado: NESTOR MUÑOZ y MARCIA TEJEDA. Si se ingresan nuevos pacientes
  es probable que los test dejen de funcionar*/

  it('si presiono "buscar" no deberia filtrar', function() {
  	element(by.id('buscar')).click();//buscar
    browser.sleep(500);
    element.all(by.buttonText('Ingresar')).then(function(items){
    	expect(items.length).toBe(2);//encuentra 2 botones Ingresar (2 filas)
    });
  });

  it('si ingreso "n" en "nombre" y presiono "buscar", deberia filtrar la fila de NESTOR MUÑOZ', function() {
  	element(by.model('nombre')).sendKeys('n');
  	element(by.id('buscar')).click();//buscar
    browser.sleep(500);
    element.all(by.buttonText('Ingresar')).then(function(items){
    	expect(items.length).toBe(1);
    });
  });

  it('si ingreso "aa" en "nombre" y presiono "buscar", deberia arrojar cero filas', function() {
  	browser.get('http://localhost:8080/triage/#/busqueda');//refresh
  	browser.sleep(500);
  	element(by.model('nombre')).sendKeys('aa');
  	element(by.id('buscar')).click();//buscar
    browser.sleep(500);
    expect(element(by.buttonText('Ingresar')).isPresent()).toBe(false);//no encuentro ningun boton en el listado
  });

  it('si filtro por "nestor" y hago click sobre el boton Ingresar el paciente ingresado debe ser NESTOR MUÑOZ', function() {
  	browser.get('http://localhost:8080/triage/#/busqueda');//refresh
  	browser.sleep(500);
  	element(by.model('nombre')).sendKeys('nestor');
    element(by.buttonText('Ingresar')).click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado');
    var nombre = element(by.binding('pacienteActual.nombre'));
    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
  });

  it('si presiono el boton "Ingresar nuevo paciente" deberia ir hacia la pantalla de alta de paciente', function() {
  	browser.get('http://localhost:8080/triage/#/busqueda');//refresh
  	browser.sleep(500);
    element(by.name('botonIngresoPaciente')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/ingreso_form');
    expect($$('.page-header h2').get(0).getText()).toBe('Ingreso paciente');    
  });
});

