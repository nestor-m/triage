package triage

class TipoDeSintoma {
	
	String nombre
	
	static hasMany = [sintomas : Sintoma]

    static constraints = {
		nombre blank:false
    }
	
	static mapping = {
		id name: 'nombre' //PK
	}
}
