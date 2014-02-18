package triage

class Persona {

    String dni 
	String nombre
	String apellido
	Date fechaDeNacimiento
	String direccion 
	String telefono 
	String obraSocial 
	String nroAfiliado	

    static hasMany = [pacientes : Paciente]    

    static constraints = {
		apellido blank: false
		nombre blank:false
		dni nullable: true 
		direccion nullable: true
		telefono nullable: true
		obraSocial nullable: true
		nroAfiliado nullable: true 
		fechaDeNacimiento(validator: { val, obj ->
			val < new Date()
		})
    }
}
