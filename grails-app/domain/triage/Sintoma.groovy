package triage

class Sintoma {
	
	String nombre
	Prioridad prioridad
	TipoDeSintoma tipoDeSintoma
	

    static constraints = {
		nombre blank:false
		prioridad blank:false
		tipoDeSintoma blank: false 
    }
}
