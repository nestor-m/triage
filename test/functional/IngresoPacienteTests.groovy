class IngresoPacienteTests extends functionaltestplugin.FunctionalTestCase {


	void testSomething() {
		get('/#/ingreso_form') {
			//parametros del GET
			//userName "marc"
			// NOTE: you can use this "method call" approach or assignment x = y
			//email "marc@somewhere.com"
		}

		form("ingreso_form") { 
			nombre = "Nestor" 
			apellido = "Muñoz"
			fechaDeNacimiento = "21/03/1987" 
			click "submit" 
			}

		assertContentContains "Lista de pacientes"
	}
	
//	void testSomething() {
//		get('http://localhost:8080/triage') {
//		}
//
//
//		assertContentContains "Triage"
//	}
}