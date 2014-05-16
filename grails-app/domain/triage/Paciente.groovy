package triage

class Paciente {

	Date fechaHoraIngreso = new Date()
	Date fechaHoraAtencion

	Integer sistole
	Integer diastole
	Integer pulso
	Integer frecuenciaRespiratoria
	Integer temperatura
	Integer saturacionO2
	Integer glucosa
	Boolean finalizado = false
	Integer tipoAtencion


	Prioridad prioridad

	static belongsTo = [persona : Persona]
	static hasMany = [sintomas : Sintoma]

	static constraints = {
		fechaHoraAtencion nullable: true
		sistole nullable: true
		diastole nullable: true
		pulso nullable: true
		frecuenciaRespiratoria nullable: true
		temperatura nullable: true
		saturacionO2 nullable: true
		glucosa nullable: true
		sintomas nullable: true
		prioridad nullable: true
		tipoAtencion nullable: true
	}

	/**
	 * Obtiene la prioridad del paciente a partir de sus sintomas.
	 * En caso de que ya se haya calculado la prioridad, no volvemos a calcular
	 * @return Prioridad.DOS o Prioridad.TRES
	 */
	Prioridad calcularPrioridad(){
		if (prioridad == null){
			Boolean esAdulto = persona.esAdulto()
			for(sintoma in sintomas){
				if((esAdulto && sintoma.prioridadAdulto == Prioridad.DOS) || (!esAdulto && sintoma.prioridadPediatrico == Prioridad.DOS)){
					this.prioridad = Prioridad.DOS
					this.save()
					return Prioridad.DOS
				}
			}

			this.prioridad = Prioridad.TRES
			this.save()
			return Prioridad.TRES
		}
		else return prioridad
	}

	/*
	 *Esta logica esta del lado del cliente, por eso para no procesar 2 veces lo mismo este metodo ya no se usa, Nestor 10/05/2014
	 */
	Boolean esPrioridadUno(){
		Boolean esAdulto = persona.esAdulto()
		for(sintoma in sintomas){
			if((esAdulto && sintoma.prioridadAdulto == Prioridad.UNO) || (!esAdulto && sintoma.prioridadPediatrico == Prioridad.UNO)){
				return true
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

	/**
	 * Indica si el paciente es adulto (para marcar la diferencia entre Triage adulto o
	 * pediátrico)
	 * @return
	 */
	Boolean esAdulto(){
		return this.persona.esAdulto()
	}


}
