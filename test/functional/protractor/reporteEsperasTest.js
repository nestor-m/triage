describe('Test pantalla de reporte de tiempo de espera', function() {
	
	it('Ingreso a la pantalla del reporte', function(){
		browser.get('http://localhost:8080/triage/');  
	    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
	    element(by.model('password')).sendKeys('admin');
	    element(by.id("ingresar")).click();
	    browser.waitForAngular();
	    
	    element(by.id("dropdownMenu1")).click();
		element(by.id("reporte_esperas")).click();
		browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_tiempo_espera');
	})
	
	it('Agrego algunos pacientes para ver algunos resultados', function(){
		browser.get('http://localhost:8080/triage/');  
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

		
		browser.sleep(1000);
		browser.waitForAngular();
	    var botonOK = $$('.modal-footer button').get(0);
	    botonOK.click();//confirmo
	    browser.sleep(1000);
	    
	    browser.waitForAngular();
		
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
	    browser.waitForAngular();
	    botonOK.click();
	    browser.waitForAngular();
		
	    element(by.id("dropdownMenu1")).click();
	    element(by.id("reporte_esperas")).click();
	    browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_tiempo_espera');
		
		element(by.model('fechaDesde')).sendKeys('10/07/2014');
		element(by.model('fechaHasta')).sendKeys('30/10/2014');
		
		 element(by.buttonText('Generar')).click();
		 browser.waitForAngular();
		 
		 
		//hay elementos en la tabla
		 expect(element(by.binding('espera.prioridad')).isPresent()).toBe(true);
		 
		 //me fijo que haya un prioridad dos
		 expect(element(by.binding('espera.prioridad')).getText()).toBe('DOS');
		 
		 //me fijo que la palabra tres no esté en pantalla (sólo agregué personas con prioridad 2)
		 var prioridad =  element(by.binding('espera.prioridad')).getText();
		 expect(prioridad == 'TRES').toBe(false);
		 
		 
		//me deslogueo logout
	    	element(by.id("dropdownUsuario")).click();
	    	element(by.id("logout")).click();
	})
	
})