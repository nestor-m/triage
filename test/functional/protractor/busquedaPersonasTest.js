describe('Test pantalla de búsqueda de personas', function() {
	
	
	it('Ingreso a la pantalla del búsqueda', function(){
		browser.get('http://localhost:8080/triage/');  
	    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
	    element(by.model('password')).sendKeys('admin');
	    element(by.id("ingresar")).click();
	    browser.waitForAngular();
	    
	    element(by.id("dropdownMenu1")).click();
		element(by.id("busqueda_personas")).click();
		browser.waitForAngular();
		expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/busqueda_personas');
	})
	
	/*Precondición: en el sistema está cargada la persona Nestor Muñoz*/
	
	it('Busco a Nestor y entro al detalle', function(){
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.waitForAngular();
	    element(by.buttonText('Detalle')).click();
	    browser.sleep(1000);
	    expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/detalle_personas');
	    var nombre = element(by.id('nombreYApellido'));
	    expect(nombre.getText()).toBe('Nombre y apellido: NESTOR MUÑOZ');
	})
	
	it('Hago una atención a Nestor', function(){
		element(by.id("inicio")).click();
		element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.waitForAngular();
	    element(by.buttonText('Ingresar')).click();
	    
	    var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		element(by.buttonText('Aceptar')).click();
		browser.sleep(1000);
	    var botonOK = $$('.modal-footer button').get(0);
	    botonOK.click();
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
		
		element.all(by.model('opciones')).get(0).click();
	    browser.waitForAngular();
	    element(by.buttonText('Finalizar')).click();
	    var botonOK = $$('.modal-footer button').get(1);
	    browser.waitForAngular();
	    botonOK.click();
	    browser.waitForAngular();
	    
	    
	    element(by.id("dropdownMenu1")).click();
		element(by.id("busqueda_personas")).click();
	    element(by.model('nombre')).sendKeys('nestor');
		element(by.id("botonBuscar")).click();
		browser.waitForAngular();
	    element(by.buttonText('Detalle')).click();
	    browser.sleep(1000);
	    
	    expect(element(by.binding('paciente.prioridad')).isPresent()).toBe(true);
		 
		//me fijo que la última atención sea prioridad DOS (que es la que ya ingresé)
		expect(element(by.binding('paciente.prioridad')).getText()).toBe('Prioridad DOS');
		expect(element(by.binding('paciente.tipoAtencion')).getText()).toBe('Ingresa');
		
	    
		//me deslogueo logout
    	element(by.id("dropdownUsuario")).click();
    	element(by.id("logout")).click();
	})
	
	
	
})