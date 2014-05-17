package triage

class Paciente {

	Date fechaHoraIngreso = new Date()
	Date fechaHoraAtencion

	String sistole
	String diastole
	String pulso
	String frecuenciaRespiratoria
	String temperatura
	String saturacionO2
	String glucosa
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
			//me fijo si es prioridad 2 segun los signos vitales
			//NOTA: los unicos signos vitales que influyen en una hipotetica Prioridad 2 son la temperatura y la glucosa
			if((esAdulto && (['38.6-39.4','39.5-41.0'].contains(this.temperatura) || this.glucosa == 'más de 300')) ||
				(this.esMenorDeTresMeses() && ['38.0-38.5','38.6-39.4','39.5-41.0','más 41.0'].contains(this.temperatura)) ||
				(this.estaEntre3y36Meses() && ['39.5-41.0','más 41.0'].contains(this.temperatura))){
					this.prioridad = Prioridad.DOS
					this.save()
					return Prioridad.DOS				
			}

			this.prioridad = Prioridad.TRES
			this.save()
			return Prioridad.TRES
		}
		else return prioridad
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

	Boolean esMenorDeTresMeses(){
		return this.persona.esMenorDeTresMeses()
	}

	Boolean estaEntre3y36Meses(){
		return this.persona.estaEntre3y36Meses()
	}

}
