casper.test.begin('Primeros pasos en Triage', 2, function suite(test) {
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