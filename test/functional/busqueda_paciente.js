casper.test.begin('Voy hacia la pantalla de busqueda de paciente', 7, function suite(test) {
    casper.start("http://localhost:8080/triage", function() {
        test.assertTitle("Triage", "el titulo es Triage, ok");
    });

    casper.then(function() {
         this.click('a[type="button"][name="adultos"]');
         test.assertEquals("http://localhost:8080/triage/#/paciente_ingreso_previo_adultos", this.getCurrentUrl(),"La url es correcta");
    });

    casper.then(function() {
         this.click('a[type="button"][name="busqueda_paciente"]');
         test.assertEquals("http://localhost:8080/triage/#/busqueda", this.getCurrentUrl(),"La url es correcta");
    });
    
    casper.then(function(){
    	test.assertTextExists('DNI','Encontre texto DNI');
    });
    
    casper.then(function(){
    	test.assertTextExists('Nombre','Encontre texto Nombre');
    });
    
    casper.then(function(){
    	test.assertTextExists('Fecha de nacimiento','Encontre texto Fecha de nacimiento');
    });
    
    casper.then(function(){
    	test.assertTextExists('Apellido','Encontre texto Apellido');
    });

    casper.run(function() {
        test.done();
    });
});


casper.test.begin('Ingreso cuatro pacientes y luego filtro el listado', 9, function suite(test) {
    casper.start("http://localhost:8080/triage/#/ingreso_form", function() {
        this.fill('form[name="ingreso_form"]', {
            'nombre':    'Juan',
            'apellido':    'Perez',
            'fechaDeNacimiento' : '1987-03-21'
        }, true);
    });
    
    casper.thenOpen('http://localhost:8080/triage/#/ingreso_form', function() {
        this.fill('form[name="ingreso_form"]', {
            'nombre':    'Roberto',
            'apellido':    'Gonzalez',
            'fechaDeNacimiento' : '1988-04-22',
            'dni' : '33688677'
        }, true);
    });
    
    casper.thenOpen('http://localhost:8080/triage/#/ingreso_form', function() {
        this.fill('form[name="ingreso_form"]', {
            'nombre':    'Carlos',
            'apellido':    'Garcia',
            'fechaDeNacimiento' : '1987-01-01'
        }, true);
    });
    
    casper.thenOpen('http://localhost:8080/triage/#/ingreso_form', function() {
        this.fill('form[name="ingreso_form"]', {
            'nombre':    'Juan',
            'apellido':    'Garcia',
            'fechaDeNacimiento' : '1985-04-18'
        }, true);
    });

    casper.thenOpen('http://localhost:8080/triage/#/busqueda', function() {
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'juan',
        }, true);
    });
    
    casper.wait(1000); //espero un segundo para que me de tiempo a filtrar el listado
    
    casper.then(function(){
    	test.assertTextExists('PEREZ','Encontre el apellido de Juan Perez');
    });
    
    casper.then(function(){
    	test.assertTextExists('GARCIA','Encontre el apellido de Juan Garcia');
    });
    
    casper.then(function(){
    	test.assertTextDoesntExist('GONZALEZ','Gonzalez es filtrado')
    });
    
    casper.thenOpen('http://localhost:8080/triage/#/busqueda', function() {
        this.fill('form[name="busqueda_form"]', {
            'apellido':'gar',
        }, true);
    });
    
    casper.wait(1000); //espero un segundo para que me de tiempo a filtrar el listado
    
    casper.then(function(){
    	test.assertTextExists('JUAN','Encontre el nombre de Juan Garcia');
    });
    
    casper.then(function(){
    	test.assertTextExists('CARLOS','Encontre el apellido de Carlos Garcia');
    });
    
    casper.then(function(){
    	test.assertTextDoesntExist('PEREZ','Perez es filtrado')
    });
    
    casper.thenOpen('http://localhost:8080/triage/#/busqueda', function() {
        this.fill('form[name="busqueda_form"]', {
            'fechaDeNacimiento':'1987-03-21',
        }, true);
    });
    
    casper.wait(1000); //espero un segundo para que me de tiempo a filtrar el listado
    
    casper.then(function(){
    	test.assertTextExists('JUAN','Encontre el nombre de Juan Perez');
    });
    
    casper.then(function(){
    	test.assertTextExists('PEREZ','Encontre el apellido de Juan Perez');
    });
    
    casper.then(function(){
    	test.assertTextDoesntExist('GARCIA','Garcia es filtrado')
    });

    casper.run(function() {
        test.done();
    });	
});


casper.test.begin('Voy hacia la pantalla de busqueda de paciente y apreto Ingresar nuevo paciente', 2, function suite(test) {
    casper.start("http://localhost:8080/triage/#/busqueda", function() {
    	this.click('a[type="button"][name="botonIngresoPaciente"]');
    	test.assertEquals("http://localhost:8080/triage/#/ingreso_form", this.getCurrentUrl(),"la url es la correcta");
    });
    
    casper.then(function(){
    	test.assertTextExists('Ingreso paciente','Encontre el texto "Ingreso paciente"');
    });

    casper.run(function() {
        test.done();
    });
});


//Me falta testear cuando se apreta un boton del listado pero parece que casper no ve los botones dentro del listado :(








