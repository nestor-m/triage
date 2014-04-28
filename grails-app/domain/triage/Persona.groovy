package triage

class Persona { //implements Serializable{

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
			val < new Date()//validacion para que la fecha de nacimiento no sea futura
		})
    }
	
	//PK = nombre + apellido + fechaDeNacimiento
//	static mapping = {
//		id composite: ['nombre','apellido','fechaDeNacimiento']
//	}

	Boolean esAdulto(){
		return getEdad() > 14 //a partir de los 15 anios una persona es considerada adulta para el triage
	}

	int getEdad(){
		int edad = (new Date() - fechaDeNacimiento) / 365 //la resta de date retorna la cantidad de dias, dividido 365 retorna la cantidad de anios
		return edad
	}

}
