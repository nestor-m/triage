describe('Test pantalla de ingreso de impresion visual', function() {

	beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');  
	      element(by.model('nombre')).sendKeys('nestor');
	      element(by.id("botonBuscar")).click();
	      browser.waitForAngular();
	      element(by.buttonText('Ingresar')).click();
	      browser.waitForAngular();
	      //element(by.id('impresion_inicial')).click(); //esto no hace falta porque al ingresar un paciente dirige 
	                                                     //a la pantalla de impresion visual
	  });
	
	
	/*Precond: tengo en la base dos síntomas de impresión visual*/
	it('chequeo que al ingresar un síntoma y volver a la pantalla, el sintoma sigue cargado', function (){
		browser.sleep(500);
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		//se que el primero del arreglo es deshidratacion de p2
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2-p1)');
		sintomas.get(0).click();
		browser.sleep(1000);
		//vuelvo a la pantalla de paciente ingresado /que ya no existe!
		element(by.buttonText('Aceptar')).click();
		browser.sleep(500);
		var botonOK = $$('.modal-footer button').get(0);
	    botonOK.click();//confirmo
	    browser.waitForAngular();
		browser.sleep(500);
		
		element(by.id('signos_vitales')).click();
		browser.sleep(500);
		//ingreso nuevamente a la impresion visual
		element(by.id('impresion_visual')).click();
		browser.sleep(500);
		
		
		var sintomas2 = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
//		 expect(sintomas2.get(0).evaluate()).toBe(true);
		
		
	})
	
	
	it ('Test que al ingresar un síntoma de prioridad 1 se muestra la pantalla de confirmación y luego la pantalla de p1', function(){
		var sintomas = element.all(by.repeater('sintomaImpresionVisual in sintomasImpresionVisual'));
		//se que el primero del arreglo es deshidratacion de p2
		expect(sintomas.get(1).getText()).toBe('DOLOR SEVERO (p1-p3)');
		sintomas.get(1).click();
		
		 expect($('.bootbox').isPresent()).toBe(true);//aparece el pedido de confirmacion
		  
		  var botonOK = $$('.modal-footer button').get(1);
		    botonOK.click();//confirmo
		    browser.waitForAngular();

		    expect(browser.getTitle()).toBe('PRIORIDAD 1');
		    browser.sleep(500);
		
	})
	
})