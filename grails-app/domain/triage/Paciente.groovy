package triage

class Paciente {
	
	Date fechaHoraIngreso
	Date fechaHoraAtencion
	
	Integer presionArterial
	Integer pulso
	Integer frecuenciaRespiratoria
	Integer temperatura

    static belongsTo = [persona : Persona]
	static hasMany = [sintomas : Sintoma]

    static constraints = {
		fechaHoraAtencion nullable: true
		presionArterial nullable: true
		pulso nullable: true
		frecuenciaRespiratoria nullable: true
		temperatura nullable: true
		sintomas nullable: true
    }
	
	/**
	 * Obtiene la prioridad del paciente a partir de sus sintomas
	 * @return Prioridad
	 */
	Prioridad prioridad(){
		for(sintoma in sintomas){
			if(sintoma.prioridad == Prioridad.UNO){
				return Prioridad.UNO
			}
		}
		
		for(sintoma in sintomas){
			if(sintoma.prioridad == Prioridad.DOS){
				return Prioridad.DOS
			}
		}
		
		return Prioridad.TRES
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
