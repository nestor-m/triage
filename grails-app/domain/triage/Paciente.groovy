package triage

class Paciente {
	
	Date fechaHoraIngreso
	Date fechaHoraAtencion
	
	Integer presionArterial
	Integer pulso
	Integer frecuenciaRespiratoria
	Integer temperatura
	
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
    }
	
	/**
	 * Obtiene la prioridad del paciente a partir de sus sintomas
	 * @return Prioridad
	 */
	Prioridad calcularPrioridad(){
		for(sintoma in sintomas){
			if(sintoma.prioridad == Prioridad.UNO){
				this.prioridad = Prioridad.UNO
				this.save()
				return Prioridad.UNO
			}
		}
		
		for(sintoma in sintomas){
			if(sintoma.prioridad == Prioridad.DOS){
				this.prioridad = Prioridad.DOS
				this.save()
				return Prioridad.DOS
			}
		}
		
		this.prioridad = Prioridad.TRES
		this.save()
		return Prioridad.TRES
	}
	
	boolean esPrioridadUno(){
		for(sintoma in sintomas){
			if(sintoma.prioridad == Prioridad.UNO){
				return true
			}
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
}
