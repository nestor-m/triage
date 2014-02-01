package triage

class Persona {

    int dni
	String nombre
	String apellido
	Date fechaDeNacimiento
	String direccion
	int telefono
	String obraSocial
	int nroAfiliado

    static constraints = {
		dni blank: false
    }
}
