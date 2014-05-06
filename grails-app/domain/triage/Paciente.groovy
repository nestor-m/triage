package triage

class Paciente {

	Date fechaHoraIngreso = new Date()
	Date fechaHoraAtencion

	Integer presionArterial
	Integer pulso
	Integer frecuenciaRespiratoria
	Integer temperatura
	Boolean finalizado

	Prioridad prioridad

	static belongsTo = [persona : Persona]
	static hasMany = [sintomas : Sintoma]

	static constraints = {
		fechaHoraAtencion nullable: true
		presionArterial nullable: true
		pulso nullable: true
		frecuenciaRespiratoria nullable: true
		temperatura nullable: true
		sintomas nullable: true
		prioridad nullable: true
		finalizado nullable: true
	}

	/**
	 * Obtiene la prioridad del paciente a partir de sus sintomas.
	 * No puede retornar Prioridad.UNO porque si es prioridad uno 
	 * el proceso no deberia llegar a llamar este metodo
	 * @return Prioridad.DOS o Prioridad.TRES
	 */
	Prioridad calcularPrioridad(){
		Boolean esAdulto = persona.esAdulto()
		def confirmarPrioridadDos = {
			this.prioridad = Prioridad.DOS
			this.save()
			return Prioridad.DOS
		}
		for(sintoma in sintomas){
			if(esAdulto){//si es adulto miro las prioridades para adulto
				if(sintoma.prioridadAdulto == Prioridad.DOS){
					confirmarPrioridadDos()
				}
			}else{//si es ninio miro las prioridades para ninio
				if(sintoma.prioridadPediatrico == Prioridad.DOS){
					confirmarPrioridadDos()
				}
			}
		}

		this.prioridad = Prioridad.TRES
		this.save()
		return Prioridad.TRES
	}

	Boolean esPrioridadUno(){
		Boolean esAdulto = persona.esAdulto()
		for(sintoma in sintomas){
			if(esAdulto){//si es adulto miro las prioridades para adulto
				if(sintoma.prioridadAdulto == Prioridad.UNO){
					return true
				}
			}else{//si es ninio miro las prioridades para ninio
				if(sintoma.prioridadPediatrico == Prioridad.UNO){
					return true
				}
			}
		}

		//TODO: falta la logica para signos vitales en pediatricos

		
		if ((pulso != null && (pulso < 40 || pulso > 150)) ||
				(frecuenciaRespiratoria != null && (frecuenciaRespiratoria < 12 || frecuenciaRespiratoria > 30 )) ||
				(temperatura != null && (temperatura < 35 || temperatura > 40))){
			return true
		}
		return false
	}

	

	/**
	 * Retorna el tiempo de espera entre el ingreso y la atencion
	 * @return String
	 */
	String demoraDeAtencion(){
		use(groovy.time.TimeCategory) {
			def duration = this.fechaHoraAtencion - this.fechaHoraIngreso

			return duration.days>0 ? duration.days + "dias": "" +
			duration.hours>0 ? duration.hours + "horas": "" +
			duration.minutes>0 ? duration.minutes + "minutos": ""
		}
	}
	
	String tiempoEspera(){
		use(groovy.time.TimeCategory) {
			Date ahora = new Date()
			def duration = ahora - this.fechaHoraIngreso
			return 	duration
		}
	}
	
	
}
