casper.test.begin('Lleno el formulario correctamente', 3, function suite(test) {
    casper.start("http://localhost:8080/triage/", function() {
        test.assertTitle("Búsqueda e ingreso de pacientes");
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'Juan',
            'apellido':    'Perez',
            'fechaDeNacimiento' : '1987-03-21'
        });
        this.click('input[name="botonIngresoPaciente"]');
    });

    casper.wait(1000); //espero un segundo para que me de tiempo a ingresar el paciente

    
    /*
     * Llego a la pantalla de paciente ingresado*/
    casper.then(function() {
    	test.assertEquals("http://localhost:8080/triage/#/paciente_ingresado", this.getCurrentUrl());
        test.assertTextExists('JUAN','Encontre el nombre ingresado');
    });

    casper.run(function() {
        test.done();
    });	
});


casper.test.begin('Ingreso un paciente sin apellido ni fecha de nacimiento', 2, function suite(test) {
    casper.start("http://localhost:8080/triage/", function() {
        test.assertTitle("Búsqueda e ingreso de pacientes", "el titulo está ok");
        this.fill('form[name="busqueda_form"]', {
            'dni':    '34071823',
            'nombre':    'Juan'
        });
        this.click('input[name="botonIngresoPaciente"]');
    });

    casper.wait(1000); //espero un segundo para que me de tiempo a ingresar el paciente

    casper.then(function() {
    	/*Me fijo que quedo en la misma página, ya que no están completos los campos obligatorios*/
    	test.assertEquals("http://localhost:8080/triage/#/", this.getCurrentUrl());
    });

    casper.run(function() {
        test.done();
    });	
});