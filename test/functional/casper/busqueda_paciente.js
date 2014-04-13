casper.test.begin('Voy hacia la pantalla de busqueda de paciente', 5, function suite(test) {
    casper.start("http://localhost:8080/triage/", function() {
        test.assertTitle("Búsqueda e ingreso de pacientes", "el titulo es Búsqueda e ingreso de pacientes");
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
    casper.start("http://localhost:8080/triage/", function() {
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'Juan',
            'apellido':    'Perez',
            'fechaDeNacimiento' : '1987-03-21'
        });
        this.click('input[name="botonIngresoPaciente"]');
    });
    
    casper.thenOpen('http://localhost:8080/triage/', function() {
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'Roberto',
            'apellido':    'Gonzalez',
            'fechaDeNacimiento' : '1988-04-22',
            'dni' : '33688677'
        });
        this.click('input[name="botonIngresoPaciente"]');
    });
    
    casper.thenOpen('http://localhost:8080/triage/', function() {
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'Carlos',
            'apellido':    'Garcia',
            'fechaDeNacimiento' : '1987-01-01'
        });
        this.click('input[name="botonIngresoPaciente"]');
    });
    
    casper.thenOpen('http://localhost:8080/triage/', function() {
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'Juan',
            'apellido':    'Garcia',
            'fechaDeNacimiento' : '1985-04-18'
        });
        this.click('input[name="botonIngresoPaciente"]');
    });

    casper.thenOpen('http://localhost:8080/triage/', function() {
        this.fill('form[name="busqueda_form"]', {
            'nombre':    'juan',
        });
        this.click('input[name="botonBuscar"]');
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
    
    casper.thenOpen('http://localhost:8080/triage/', function() {
        this.fill('form[name="busqueda_form"]', {
            'apellido':'gar',
        });
        this.click('input[name="botonBuscar"]');
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
    
    casper.thenOpen('http://localhost:8080/triage/', function() {
        this.fill('form[name="busqueda_form"]', {
            'fechaDeNacimiento':'1987-03-21',
        });
        this.click('input[name="botonBuscar"]');
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