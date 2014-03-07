package triage

class TipoDeSintoma {
	
	String nombre
	
	static hasMany = [sintomas : Sintoma]

    static constraints = {
		nombre unique:true
    }
	
//	static mapping = {
//		id name: 'nombre' //PK //esto no andaba bien, lo reemplaze con el unique en nombre

}
