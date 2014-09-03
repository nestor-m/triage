package triage

class Usuario {
	
	String nombre
	String password
	Rol rol

    static constraints = {
		nombre unique:true
    }

}