describe('Test reporte de prioridades', function() {
	beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');  
	      browser.waitForAngular();
	  });
	it('Testeo que existe la pantalla del reporte', function(){
		element(by.id("reporte_prioridades")).click();
		browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/reporte_prioridades');
	});
	
	it('Agrego una persona con prioridad 1 y chequeo que para la fecha de hoy haya un P1', function() {
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
	    //clickeo en "Ingresa"
	    element.all(by.model('opciones')).get(0).click();
	    browser.sleep(1000);
	    element(by.buttonText('Finalizar')).click();
	    var botonOK = $$('.modal-footer button').get(1);
	    browser.sleep(1000);
	    botonOK.click();//confirmo
	    browser.sleep(1000);
	    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/pacientes_espera');	   
	});
	
}
)
	