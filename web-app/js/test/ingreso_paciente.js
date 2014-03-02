casper.test.begin('Lleno el formulario correctamente', 2, function suite(test) {
    casper.start("http://localhost:8080/triage/#/ingreso_form", function() {
        test.assertTitle("Triage adultos - Ingreso paciente - Paciente previo", "el titulo está ok");
        this.fill('form[name="ingreso_form"]', {
            'nombre':    'Juan',
            'apellido':    'Perez',
            'fechaDeNacimiento' : '1987-03-21'
        }, true);
    });

    casper.then(function() {
    	test.assertEquals("http://localhost:8080/triage/#/", this.getCurrentUrl());
    });

    casper.run(function() {
        test.done();
    });	
});


casper.test.begin('Ingreso un paciente sin apellido ni fecha de nacimiento', 2, function suite(test) {
    casper.start("http://localhost:8080/triage/#/ingreso_form", function() {
        test.assertTitle("Triage adultos - Ingreso paciente - Paciente previo", "el titulo está ok");
        this.fill('form[name="ingreso_form"]', {
            'dni':    '34071823',
            'nombre':    'Juan'
        }, true);
    });

    casper.then(function() {
    	/*Me fijo que quedo en la misma página, ya que no están completos los campos obligatorios*/
    	test.assertEquals("http://localhost:8080/triage/#/ingreso_form", this.getCurrentUrl());
    });

    casper.run(function() {
        test.done();
    });	
});

casper.test.begin('Ingreso un paciente con fecha de nacimiento futura', 3, function suite(test) {
    casper.start("http://localhost:8080/triage/#/ingreso_form", function() {
        test.assertTitle("Triage adultos - Ingreso paciente - Paciente previo", "el titulo está ok");
        this.fill('form[name="ingreso_form"]', {
        	'nombre':    'Juan',
            'apellido':    'Perez',
            'fechaDeNacimiento' : '2050-03-21'
        }, true);
    });

    casper.then(function() {
    	//Me fijo que quedo en la misma página, ya que no están completos los campos obligatorios
    	test.assertEquals("http://localhost:8080/triage/#/ingreso_form", this.getCurrentUrl());
    	test.assertTextExists('Ingreso paciente','Existe Ingreso paciente');
    });

    casper.run(function() {
        test.done();
    });	
});