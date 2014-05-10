describe('Test pantalla de pacientes en espera', function() {
	beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');  
	      element(by.model('nombre')).sendKeys('nestor');
	      element(by.id("botonBuscar")).click();
	      browser.waitForAngular();
	      element(by.buttonText('Ingresar')).click();
	      browser.waitForAngular();
	      
	  });
	
	/**
	 * Tenemos en cuenta para este test que hay un sólo Nestor y su apellido es Muñoz
	 */
	it('Chequeo que salgo de la pantalla del paciente, lo busco en la lista de espera y lo encuentro', function(){
		//se que ya estoy en la pantalla de impresion visual
		var nombre = element(by.binding('pacienteActual.nombre'));
	    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		element(by.buttonText('Salir')).click();
		browser.sleep(500);
		element(by.id('pacientes_espera')).click();
		browser.sleep(500);
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.sleep(500);
		element(by.buttonText('Triage')).click();
		var nombre = element(by.binding('pacienteActual.nombre'));
	    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado'); 
	})
	
	
	/**
	 * Tenemos en cuenta para este test que hay un sólo Nestor y su apellido es Muñoz
	 */
	it('Chequeo que finalizar paciente quite al paciente de la lista de espera', function(){
		var nombre = element(by.binding('pacienteActual.nombre'));
	    expect(nombre.getText()).toBe('NESTOR MUÑOZ');
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		element(by.buttonText('Salir')).click();
		browser.sleep(500);
		element(by.id('pacientes_espera')).click();
		browser.sleep(500);
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.sleep(500);
		
		element(by.buttonText('Finalizar')).click();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/finalizar_paciente');
		var nombre = element(by.binding('paciente.nombre'));
	    expect(nombre.getText()).toBe('Nombre y apellido: NESTOR MUÑOZ');
	    //clickeo en "Ingresa"
	    element.all(by.model('opciones')).get(0).click();
	    browser.sleep(1000);
	    element(by.buttonText('Finalizar')).click();
	    var botonOK = $$('.modal-footer button').get(1);
	    browser.sleep(1000);
	    botonOK.click();//confirmo
	    browser.sleep(1000);
	    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/pacientes_espera');	    
	})
	
	
	
})