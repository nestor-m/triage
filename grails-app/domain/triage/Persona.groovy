package triage

class Persona {

    int dni
	String nombre
	String apellido
	String fechaDeNacimiento
	String direccion
	int telefono
	String obraSocial
	int nroAfiliado
	

    static hasMany = [pacientes : Paciente]    

    static constraints = {
		apellido blank: false
    }
}
