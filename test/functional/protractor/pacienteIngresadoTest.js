describe('Test pantalla paciente ingresado', function() {
	
  beforeEach(function() {
  	//ingreso el paciente Nestor Muñoz
    browser.get('http://localhost:8080/triage/');  
    element(by.model('nombre')).sendKeys('nestor');
    element(by.id("botonBuscar")).click();
    browser.waitForAngular();
    element(by.buttonText('Ingresar')).click();
    browser.waitForAngular();
  });
  
  it('Navego desde impresión visual a carga de síntomas', function() {
  	element(by.id("cargaSintomas")).click();//presiono boton sintomas
  	browser.waitForAngular();  	
  	expect(browser.getTitle()).toBe('Ingreso de síntomas');//chequeo el titulo
  });
  
  it('Navego desde carga de síntomas a impresión visual', function() {
  	element(by.id("cargaSintomas")).click();//presiono boton sintomas
  	browser.waitForAngular();
  	element(by.id("impresion_visual")).click();//presiono boton impresion visual
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Impresión Visual');//chequeo el titulo
  }); 

  it('Navego desde carga de signos vitales a impresión visual', function() {
  	element(by.id("signos_vitales")).click();//presiono boton signos vitales
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Signos Vitales');//chequeo el titulo
  	element(by.id("impresion_visual")).click();//presiono boton impresion visual
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Impresión Visual');//chequeo el titulo
  });   

  it('Me quedo en la misma pantalla', function() {
  	var botonImpresionVisual = element(by.id('impresion_visual'));
  	expect(botonImpresionVisual.isEnabled()).toBe(false);
  }); 
  
  it('Salgo de la pantalla paciente ingresado', function() {
  	element(by.id('salir')).click();//presiono el boton Salir
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('Búsqueda e ingreso de pacientes');//chequeo el titulo
  });

  it('Finalizar triage', function() {
  	element(by.id('finalizarTriage')).click();//presiono el boton Finalizar Triage
  	browser.waitForAngular();
  	expect(browser.getTitle()).toBe('PRIORIDAD 3');//chequeo el titulo
    expect(element(by.id("nombreYApellido")).getText()).toBe("Nombre y apellido: NESTOR MUÑOZ")
  }); 
  
});

	