describe('Test reporte de prioridades', function() {

	beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');
	      element(by.model('nombre')).sendKeys('admin');//me logueo con admin
	      element(by.model('password')).sendKeys('admin');
	      element(by.id("ingresar")).click();
	      browser.waitForAngular();
	});

	it('Testeo que existe la pantalla del reporte', function(){
		element(by.id("dropdownMenu1")).click();
		element(by.id("reporte_prioridades")).click();
		browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_prioridades');
	});
	
	it('Agrego una persona con prioridad 2 y chequeo que para la fecha de hoy haya un P2', function() {
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
	    botonOK.click();//confirmo
	    browser.sleep(1000);
		
		element(by.buttonText('Salir')).click();		
		
		browser.get('http://localhost:8080/triage/');
		element(by.id('espera')).click();
	    browser.waitForAngular();
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
	    browser.waitForAngular();
		
		element(by.buttonText('Finalizar')).click();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/finalizar_paciente');
		var nombre = element(by.binding('paciente.nombre'));
	    expect(nombre.getText()).toBe('Nombre y apellido: NESTOR MUÑOZ');
	    
	    element.all(by.model('opciones')).get(0).click();
	    browser.waitForAngular();
	    element(by.buttonText('Finalizar')).click();
	    var botonOK = $$('.modal-footer button').get(1);
	    botonOK.click();
	    browser.sleep(1000);
	    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/pacientes_espera');	

   		element(by.id("dropdownMenu1")).click();
	    element(by.id("reporte_prioridades")).click();
	    browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_prioridades');
		
		element(by.model('fechaDesde')).sendKeys('10/07/2014');
		element(by.model('fechaHasta')).sendKeys('30/07/2014');
		
		element(by.buttonText('Generar')).click();
	    browser.waitForAngular();
		 
		//hay elementos en la tabla
		expect(element(by.binding('prioridad.prioridad')).isPresent()).toBe(true);
		 
		//me fijo que haya un prioridad dos
		expect(element(by.binding('prioridad.prioridad')).getText()).toBe('DOS');
		 
		//me fijo que la palabra tres no esté en pantalla (sólo agregué personas con prioridad 2)
		var prioridad =  element(by.binding('prioridad.prioridad')).getText();
		expect(prioridad == 'TRES').toBe(false);		 
	});
	
});
	