describe('Test pantalla de ingreso de signos vitales', function() {

	
	
	
	  beforeEach(function() {
	      browser.get('http://localhost:8080/triage/');  
	      element(by.model('nombre')).sendKeys('nestor');
	      element(by.id("botonBuscar")).click();
	      browser.waitForAngular();
	      element(by.buttonText('Ingresar')).click();
	      browser.waitForAngular();

	      element(by.id('signos_vitales')).click();;
	  });

  
  it('chequeo que los sintomas ingresados sean los mismos cuando vuelvo a la pantalla', function() {
	  
	  /*Método encontrado en internet para seleccionar items en un dropdown*/
	  var selectDropdownbyNum = function ( element, optionNum ) {
		    if (optionNum){
		      var options = element.findElements(by.tagName('option'))   
		        .then(function(options){
		          options[optionNum].click();
		        });
		    }
		  };
		  var selectPulso = selectDropdownbyNum(element(by.id('pulso')), 8);
		  var selectPresion = selectDropdownbyNum(element(by.id('presion')), 2);
		  var selectTemperatura = selectDropdownbyNum(element(by.id('temperatura')), 8);
		  var selectFrecuencia = selectDropdownbyNum(element(by.id('frecuencia')), 7);
		  browser.sleep(500);
		  //Salgo de la pantalla
		  element(by.buttonText('Aceptar')).click();
		  browser.waitForAngular();
		  element(by.buttonText('OK')).click();//mensaje de carga exitosa
		  //Entro a la pantalla de paciente ingresado con todas las opciones
		  expect(browser.getCurrentUrl()).toBe('http://localhost:8080/triage/#/paciente_ingresado');
		  element(by.id('impresion_visual')).click();
		  browser.waitForAngular();
		  //Vuelvo a la lista de signos vitales..
		  element(by.id('signos_vitales')).click();
		  browser.sleep(500);
		  //Yo sé qué elegí en cada opción...
		  expect(element(by.selectedOption('$parent.pulso')).getText()).toEqual('80');
		  expect(element(by.selectedOption('$parent.presion')).getText()).toEqual('1112');
		  expect(element(by.selectedOption('$parent.temperatura')).getText()).toEqual('37');
		  expect(element(by.selectedOption('$parent.frecuencia')).getText()).toEqual('15');		  
  });
  
  
  it('TEST que temperatura 33 es p1', function(){
	  var selectDropdownbyNum = function ( element, optionNum ) {
		    if (optionNum){
		      var options = element.findElements(by.tagName('option'))   
		        .then(function(options){
		          options[optionNum].click();
		        });
		    }
		  };
		  
		  expect($('.bootbox').isPresent()).toBe(false);//el pedido de confirmacion no exite
		  //selecciono la temperatura en 33
		  var selectTemperatura = selectDropdownbyNum(element(by.id('temperatura')), 4);
		  browser.sleep(500);
		  expect($('.bootbox').isPresent()).toBe(true);//aparece el pedido de confirmacion
		  
		  var botonOK = $$('.modal-footer button').get(1);
		    botonOK.click();//confirmo
		    browser.waitForAngular();

		    expect(browser.getTitle()).toBe('PRIORIDAD 1');
		    browser.sleep(500);
  });
  

  
  
  
});

	