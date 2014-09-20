describe('Test ABM de usuarios', function() {

  /*PRECONDICION: en el sistema estan cargados los síntomas: “DOLOR SEVERO” y “DESHIDRATACION” 
  del determinante “IMPRESION INICIAL”, y “CONTRACTURA” del determinante “DOLOR MUSCULAR”. 
  Los pacientes NESTOR MUÑOZ Y MARCIA TEJEDA y los usuarios ADMIN (con rol ADMINISTRADOR) y USER (con rol USUARIO)
  Si se ingresan nuevos sintomas es probable que los test dejen de funcionar*/

  function logout(){
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();//me deslogueo
    browser.waitForAngular();
  }

  function loginAdmin(){
    element(by.model('nombre')).sendKeys('admin');//me logueo con admin
    element(by.model('password')).sendKeys('admin');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
  }

  function voyPantallaUsuarios(){
    element(by.id("dropdownConfiguracion")).click();
    element(by.id("usuarios")).click();//voy a la pantalla de usuarios
    browser.waitForAngular();
  }

  function voyPantallaCambioPass(){
    element(by.id("dropdownUsuario")).click();
    element(by.id("cambiarPassword")).click();//voy a la pantalla de cambiarPassword
    browser.waitForAngular();
  }
  
  it('Crear usuario con rol ADMINISTRADOR', function() {
    browser.get('http://localhost:8080/triage/');
    loginAdmin();
    voyPantallaUsuarios();

    element(by.id("nuevo")).click();//presiono boton nuevo
    //lleno el formulario de nuevo usuario
    element(by.model('usuario.nombre')).sendKeys('nestor');//en campo nombre ingreso nestor
    element(by.select("usuario.rol")).click();
    element(by.id('rolAdministrador')).click();//en campo rol selecciono ADMINISTRADOR
    element(by.id('aceptar')).click();//presiono aceptar
    browser.waitForAngular();    
    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('Usuario NESTOR creado con éxito');//aparece el mensaje de carga exitosa
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer

    //Me deslogueo y me dirijo a la pagina de login
    logout();

    //Me logueo con el usuario recien creado
    element(by.model('nombre')).sendKeys('nestor');
    element(by.model('password')).sendKeys('triage');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(browser.getTitle()).toBe('Búsqueda e ingreso de pacientes');//me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes
    expect(element(by.id("configuracion")).isDisplayed()).toBe(true);//*configuracion debe aparecer en el menu
  });

  it('Crear usuario con rol USUARIO', function() {
    voyPantallaUsuarios();
    element(by.id("nuevo")).click();//presiono boton nuevo
    //lleno el formulario de nuevo usuario
    element(by.model('usuario.nombre')).sendKeys('marcia');//en campo nombre ingreso marcia
    element(by.select("usuario.rol")).click();
    element(by.id('rolUsuario')).click();//en campo rol selecciono USUARIO
    element(by.id('aceptar')).click();//presiono aceptar
    browser.waitForAngular();    
    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('Usuario MARCIA creado con éxito');//aparece el mensaje de carga exitosa
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer

    //Me deslogueo y me dirijo a la pagina de login
    logout();

    //Me logueo con el usuario recien creado
    element(by.model('nombre')).sendKeys('marcia');
    element(by.model('password')).sendKeys('triage');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(browser.getTitle()).toBe('Búsqueda e ingreso de pacientes');//me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes
    expect(element(by.id("configuracion")).isDisplayed()).toBe(false);//*configuracion no debe aparecer en el menu
  });

  it('Cambio de contraseña', function() {
    voyPantallaCambioPass();
    expect(browser.getTitle()).toBe('Cambiar contraseña');
    element(by.model('pass.anterior')).sendKeys('triage');//ingreso la password anterior
    element(by.model('pass.nueva')).sendKeys('passnueva');//ingreso la password nueva
    element(by.model('pass.repite')).sendKeys('passnueva');//repito la password nueva
    element(by.id("aceptar")).click();//presiono aceptar
    browser.waitForAngular();    
    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('Contraseña actualizada con éxito');//aparece el mensaje de cambio de password exitoso
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer
    //me deslogueo
    logout();
    //Intento loguearme con la password vieja
    element(by.model('nombre')).sendKeys('marcia');//me logueo con admin
    element(by.model('password')).sendKeys('triage');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(element(by.id("mensajeError")).isDisplayed()).toBe(true);//se debe mostrar el mensaje de error
    //limpio el formulario
    element(by.model('nombre')).clear();
    element(by.model('password')).clear();;
    //me logueo con la password nueva
    element(by.model('nombre')).sendKeys('marcia');//me logueo con marcia
    element(by.model('password')).sendKeys('passnueva');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(browser.getTitle()).toBe('Búsqueda e ingreso de pacientes');//me logueo y me dirige a la pantalla de busqueda e ingreso de pacientes
    logout();
  });

  it('eliminar', function() {
    loginAdmin();
    voyPantallaUsuarios();
    element(by.model('nombre')).sendKeys('nestor');//filtro el listado de usuarios
    element(by.id("buscar")).click();
    browser.waitForAngular();
    element.all(by.id('verDetalle')).then(function(items){
        expect(items.length).toBe(1);//deberia mostrarse solo la fila del usuario nestor
    });
    element(by.id('eliminar')).click();//presiono eliminar
    browser.waitForAngular();
    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('¿Está seguro que quiere eliminar el usuario NESTOR?');//deberia aparecer este mensaje
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer
    expect(element(by.id("alert")).isDisplayed()).toBe(true);//se debe mostrar el mensaje de usuario eliminado con exito
    expect(element(by.id('verDetalle')).isPresent()).toBe(false);//el listado deberia estar vacio
    //me deslogueo
    logout();
    //Intento loguearme con usuario nestor
    element(by.model('nombre')).sendKeys('nestor');
    element(by.model('password')).sendKeys('triage');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(element(by.id("mensajeError")).isDisplayed()).toBe(true);//no deberia poder loguearme
    element(by.model('nombre')).clear();
    element(by.model('password')).clear();
  });

  it('Cambiar rol de usuario', function() {
    loginAdmin();
    voyPantallaUsuarios();
    element(by.model('nombre')).sendKeys('mar');//filtro el listado de usuarios
    element(by.id("buscar")).click();
    browser.waitForAngular();
    element.all(by.id('verDetalle')).then(function(items){
        expect(items.length).toBe(1);//deberia mostrarse solo la fila del usuario marcia
    });
    element(by.id('verDetalle')).click();//presiono verDetalle
    browser.waitForAngular();
    expect(browser.getTitle()).toBe('Formulario de usuario');//me dirige al formulario de usuario
    //los campos deberian estar llenos
    var inputNombre = element(by.model('usuario.nombre'));
    expect(inputNombre.getAttribute('value')).toEqual('MARCIA');
    var inputRol = element(by.model('usuario.rol'));
    expect(inputRol.getAttribute('value')).toEqual('USUARIO');

    element(by.select("usuario.rol")).click();
    element(by.id('rolAdministrador')).click();//en campo rol selecciono ADMINISTRADOR
    element(by.id('aceptar')).click();//presiono aceptar
    browser.waitForAngular();    
    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('Usuario MARCIA actualizado con éxito');//aparece el mensaje de exito
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer
    logout();
    element(by.model('nombre')).sendKeys('marcia');//me logueo con marcia
    element(by.model('password')).sendKeys('passnueva');
    element(by.id("ingresar")).click();
    browser.waitForAngular();
    expect(element(by.id("configuracion")).isDisplayed()).toBe(true);//*configuracion debe aparecer en el menu
  });

  it('Intento crear dos usuarios con el mismo nombre', function() {
    voyPantallaUsuarios();
    element(by.id("nuevo")).click();//presiono boton nuevo
    //lleno el formulario de nuevo usuario
    element(by.model('usuario.nombre')).sendKeys('marcia');//en campo nombre ingreso marcia
    element(by.select("usuario.rol")).click();
    element(by.id('rolUsuario')).click();//en campo rol selecciono USUARIO
    element(by.id('aceptar')).click();//presiono aceptar
    browser.waitForAngular();    
    var dialogo = $('.bootbox').$('.modal-dialog').$('.modal-content').$('.modal-body').$('.bootbox-body');
    expect(dialogo.getText()).toBe('Error. Ya existe un usuario con el nombre MARCIA');//aparece el mensaje de error
    element(by.buttonText('OK')).click();//presiono OK
    browser.sleep(1000);//lo duermo porque el modal tarda en desaparecer
  });

  it('intento cambiar la contraseña por una de menos de 4 caracteres', function() {
    voyPantallaCambioPass();
    element(by.model('pass.nueva')).sendKeys('aaa');//ingreso la password nueva
    element(by.model('pass.repite')).sendKeys('aaa');//repito la password nueva
    element(by.tagName('h3')).click();//activo el ng-blur
    expect(element(by.id("passCorta")).isDisplayed()).toBe(true);//se muestra el mensaje de pass demasiado corta
  });

  it('No repito la nueva contraseña', function() {
    element(by.model('pass.nueva')).clear();//limpio los campos
    element(by.model('pass.repite')).clear();

    element(by.model('pass.nueva')).sendKeys('passnueva');//ingreso la password nueva
    element(by.model('pass.repite')).sendKeys('PASSNUEVA');//no repito la password nueva
    element(by.tagName('h3')).click();//activo el ng-blur
    expect(element(by.id("passNoCoinciden")).isDisplayed()).toBe(true);//se muestra el mensaje de No coinciden las passwords
  });

  it('El nombre del usuario debe tener al menos 3 caracteres', function() {
    voyPantallaUsuarios();
    element(by.id("nuevo")).click();//presiono boton nuevo
    element(by.model('usuario.nombre')).sendKeys('ro');//en campo nombre ingreso ro
    element(by.select("usuario.rol")).click();//activo el ng-blur
    expect(element(by.id("nombreCorto")).isDisplayed()).toBe(true);//se muestra el mensaje de nombre demasiado corto
    //me deslogueo logout
    element(by.id("dropdownUsuario")).click();
    element(by.id("logout")).click();
  });

});

