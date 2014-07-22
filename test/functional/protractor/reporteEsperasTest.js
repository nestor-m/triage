describe('Test pantalla de reporte de tiempo de espera', function() {
	beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');  
	      browser.sleep(2000);
	  });
	
	it('Ingreso a la pantalla del reporte', function(){
		element(by.id("reporte_esperas")).click();
		browser.sleep(2000);
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_tiempo_espera');
	})
	
	it('Agrego algunos pacientes para ver algunos resultados', function(){
		element(by.model('nombre')).sendKeys('nestor');
	    element(by.id("botonBuscar")).click();
	    browser.waitForAngular();
	    element(by.buttonText('Ingresar')).click();
	    browser.waitForAngular();
		var nombre = element(by.binding('pacienteActual.nombre'));
	    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado'); 
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		element(by.buttonText('Aceptar')).click();
		
		var botonOK = $$('.modal-footer button').get(0);
	    browser.sleep(1000);
	    botonOK.click();//confirmo
	    browser.sleep(1000);
		
		element(by.buttonText('Salir')).click();
		
		
		browser.get('http://localhost:8080/triage/');
		element(by.id('pacientes_espera')).click();
		browser.sleep(500);
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.sleep(500);	
		
		element(by.buttonText('Finalizar')).click();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/finalizar_paciente');
		var nombre = element(by.binding('paciente.nombre'));
	    expect(nombre.getText()).toBe('Nombre y apellido: NESTOR MUÑOZ');
	    
	    element.all(by.model('opciones')).get(0).click();
	    browser.sleep(1000);
	    element(by.buttonText('Finalizar')).click();
	    var botonOK = $$('.modal-footer button').get(1);
	    browser.sleep(1000);
	    botonOK.click();
	    browser.sleep(1000);
		
	    
	    element(by.id("reporte_esperas")).click();
	    browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_tiempo_espera');
		
		element(by.model('fechaDesde')).sendKeys('10/07/2014');
		element(by.model('fechaHasta')).sendKeys('30/07/2014');
		
		 element(by.buttonText('Generar')).click();
		 browser.sleep(1500);
	})
	
})