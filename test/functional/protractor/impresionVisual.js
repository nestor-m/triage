describe('Test pantalla de ingreso de impresion visual', function() {

	beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');  
	      element(by.model('nombre')).sendKeys('nestor');
	      element(by.id("botonBuscar")).click();
	      browser.waitForAngular();
	      element(by.buttonText('Ingresar')).click();
	      browser.waitForAngular();
	      element(by.id('impresion_inicial')).click();
	  });
	
	
	/*Precond: tengo en la base dos síntomas de impresión visual*/
	it('chequeo que al ingresar un síntoma y volver a la pantalla, el sintoma sigue cargado', function (){
		var sintomas = element.all(by.repeater('sintoma in sintomas'));
		//se que el primero del arreglo es deshidratacion de p2
		expect(sintomas.get(0).getText()).toBe('DESHIDRATACION (p2)');
		sintomas.get(0).click();
		browser.sleep(500);
		
		//vuelvo a la pantalla de paciente ingresado
		element(by.buttonText('Continuar')).click();
		browser.sleep(500);
		
		//ingreso nuevamente a la impresion visual
		element(by.id('impresion_inicial')).click()
		browser.sleep(500);
		
		
	})
	
	
})