casper.test.begin('Primeros pasos en Triage', 3, function suite(test) {
    casper.start("http://localhost:8080/triage", function() {
        test.assertTitle("Triage", "el titulo es Triage, ok");
    });

    casper.then(function() {
         this.click('a[type="button"][name="adultos"]');
         test.assertEquals("http://localhost:8080/triage/#/paciente_ingreso_previo_adultos", this.getCurrentUrl());
    });

    casper.then(function() {
         this.click('a[type="button"][name="ingreso_paciente"]');
         test.assertEquals("http://localhost:8080/triage/#/ingreso_form", this.getCurrentUrl());
    });

    casper.run(function() {
        test.done();
    });
});

