package triage

class Sintoma implements Serializable{
	
	String nombre
	Prioridad prioridad
	TipoDeSintoma tipoDeSintoma
	
	static belongsTo = [tipoDeSintoma : TipoDeSintoma]	

    static constraints = {
		nombre unique: 'tipoDeSintoma'//nombre + tipo de sintoma son unicos
    }
	
//	static mapping = {
//		id composite: ['nombre','tipoDeSintoma'] //PK // Esto no andaba bien, lo reemplaze por: nombre unique: 'tipoDeSintoma'
//	}
}
