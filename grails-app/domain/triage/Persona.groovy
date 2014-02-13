package triage

class Persona {

    String dni 
	String nombre
	String apellido
	String fechaDeNacimiento
	String direccion 
	String telefono 
	String obraSocial 
	String nroAfiliado	

    static hasMany = [pacientes : Paciente]    

    static constraints = {
		dni nullable: true 
		direccion nullable: true
		telefono nullable: true
		obraSocial nullable: true
		nroAfiliado nullable: true 
    }
}
