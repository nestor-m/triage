package triage

class Usuario {
	
	String nombre
	String password
	Rol rol

    static constraints = {
		nombre unique:true, minSize:3//el nombre es unico y de 3 caracteres minimo
		password minSize:4//la password es de 4 caracteres minimo
    }

}