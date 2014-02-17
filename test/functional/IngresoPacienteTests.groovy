class IngresoPacienteTests extends functionaltestplugin.FunctionalTestCase {


	void testBotonAdultos() {
		get('/')// {
			//parametros del GET
			//userName "marc"
			// NOTE: you can use this "method call" approach or assignment x = y
			//email "marc@somewhere.com"
		//}
		click "adultos"
		assertStatus 200
		assertContentContains "Triage adultos"
		

//		form("ingreso_form") { 
//			nombre = "Nestor" 
//			apellido = "Muñoz"
//			fechaDeNacimiento = "21/03/1987" 
//			click "submit" 
//			}
//
//		assertContentContains "Lista de pacientes"
//		assertContentContains "Nestor"
//		assertContentContains "sadfhisuhfoisahdfksdhf fskdhf sdhfsjkdhf isdhf oisdhfiu"
	}
	
//	void testSomething() {
//		get('http://localhost:8080/triage') {
//		}
//
//
//		assertContentContains "Triage"
//	}
}