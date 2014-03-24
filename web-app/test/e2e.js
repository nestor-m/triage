'use strict';

describe('Prueba E2E test angular', function() {
    
	it('El titulo debe ser Triage', function() {
		browser().navigateTo('http://localhost:8080/triage');
		expect(element('h1').text()).toEqual('Triage');
	});
	
	describe('Test pantalla de impresion inicial',function(){
		
	    it('Ingreso una nueva persona',function() {
	        browser().navigateTo('ingreso_form.html');
	        input('nombre').enter('test');
	        input('apellido').enter('test');
	        input('fechaDeNacimiento').enter('2014/03/21');
	        element(':submit').click();
	      });
	    
		it('estoy en pantalla de paciente ingresado y presiono el boton "impresion inicial"', function() {
			sleep(1);
			browser().navigateTo('paciente_ingresado.html');
			expect(element('label').text()).toEqual('Paciente ingresado:');
			expect(element('#nombreApellido').text()).toEqual('TEST TEST');
			element('#impresion_inicial').click();
		});
	    
		it('Estoy en la pantalla de impresion inicial y marco los sintomas', function() {
			browser().navigateTo('impresion_visual.html');
			expect(element('h3').text()).toEqual('Impresión Visual');
			sleep(1);
			expect(element('#nombreApellido').text()).toEqual('TEST TEST');
			element("label:contains('DOLOR SEVERO (p1)')").click();
			element("label:contains('DESHIDRATACION (p2)')").click();
			element(':submit').click();
		});
	    
		it('En la pantalla de prioridad uno esta el nombre del paciente y los sintomas ingresados', function() {
			browser().navigateTo('prioridad1.html');
			sleep(1);
			expect(element('h1').text()).toEqual('PRIORIDAD 1');
			expect(element('#nombreYApellido').text()).toEqual('Nombre y apellido: TEST TEST');
			expect(element("#sintomas").text()).toContain('DOLOR SEVERO (p1)');
			expect(element("#sintomas").text()).toContain('DESHIDRATACION (p2)');
		});
	});
});