package triage

class Sintoma implements Serializable{
	
	String nombre
	Prioridad prioridad
	TipoDeSintoma tipoDeSintoma
	
	static belongsTo = [tipoDeSintoma : TipoDeSintoma]	

    static constraints = {
		nombre blank:false
		prioridad blank:false
		tipoDeSintoma blank: false 
    }
	
	static mapping = {
		id composite: ['nombre','tipoDeSintoma'] //PK
	}
}
