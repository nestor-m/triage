casper.test.begin('Testeo que al ingresar un sintoma de p1, me lleva a la pantalla de p1', 5, function suite(test) {
    casper.start("http://localhost:8080/triage", function() {
        test.assertTitle("Triage", "el titulo es Triage, ok");
    });

    casper.then(function() {
        this.click('a[type="button"][name="adultos"]');
        test.assertEquals("http://localhost:8080/triage/#/paciente_ingreso_previo_adultos",
        				this.getCurrentUrl(), 'Llego a la pantalla de adultos');
   });

   casper.then(function() {
        this.click('a[type="button"][name="ingreso_paciente"]');
        test.assertEquals("http://localhost:8080/triage/#/ingreso_form", 
        		this.getCurrentUrl(), 'Llego a la pantalla de ingreso del paciente');
   });
   
   casper.then( function() {
       test.assertTitle("Triage adultos - Ingreso paciente - Paciente previo", "el titulo está ok");
       this.fill('form[name="ingreso_form"]', {
           'nombre':    'Juan',
           'apellido':    'Perez',
           'fechaDeNacimiento' : '1987-03-21'
       }, true);
   });
   
   casper.wait(1000);//Espero un segundo para que se carque el paciente y me redirija a la pantalla de paciente ingresado
   
   casper.then(function() {
       test.assertEquals("http://localhost:8080/triage/#/paciente_ingresado", 
    		   	this.getCurrentUrl(), 'Llego a la pantalla de paciente ingresado');
  });
   
   casper.then(function() {
	   this.click('a[type="button"][name="impresion_inicial"]');
       test.assertEquals("http://localhost:8080/triage/#/impresion_visual", 
    		   	this.getCurrentUrl(), 'Llego a la pantalla de impresion visual');
  });
   
   casper.wait(1000);//Espero que se carguen los sintomas de impresion inicial

   casper.then(function() {
	   //input o checkbox no funcionan 
	   this.clickLabel('DOLOR SEVERO (p1)', 'label');
	   //this.click('#DOLOR SEVERO (p1)');
	});
   
   casper.then(function() {
       this.click('input[name="continuar"]');
       test.assertEquals("http://localhost:8080/triage/#/prioridad1", this.getCurrentUrl(),"La url es correcta");
  });
  
   
   
    casper.run(function() {
        test.done();
    });
});
