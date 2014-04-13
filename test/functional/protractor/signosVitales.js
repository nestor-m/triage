describe('Test pantalla de ingreso de signos vitales', function() {

  it('el titulo debe ser "Búsqueda e ingreso de pacientes"', function() {
    browser.get('http://localhost:8080/triage/');

    browser.sleep(500);

    expect($$('.page-header h4').get(0).getText()).toBe('Búsqueda e ingreso de pacientes');    
  });


  it('filtro por "nestor" e ingreso el paciente NESTOR MUÑOZ', function() {
  	element(by.model('nombre')).sendKeys('nestor');
    element(by.buttonText('Buscar')).click();
    browser.sleep(500);
    element(by.buttonText('Ingresar')).click();
    browser.sleep(500);
    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado');
    var nombre = element(by.binding('pacienteActual.nombre'));
    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
  });
  
  
  it('ingreso a la pantalla de signos vitales', function(){
	  element(by.id('signos_vitales')).click();
	  browser.sleep(500);
	  expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/signos_vitales');
  });
  
  
  
});

	