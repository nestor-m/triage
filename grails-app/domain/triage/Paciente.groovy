/* 
Copyright (C) 2015  Nestor Muñoz. nestorgabriel2008@gmail.com; Marcia Tejeda. tejedamarcia@gmail.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

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
		Boolean esAdulto = persona.esAdulto()

		//CHEQUEO SI ES PRIORIDAD 1, lo normal seria que la prioridad uno se detecte sin llamar a este metodo pero igualmente se puede dar el caso en que se presione el boton "Fin triage" con sintomas de prioridad uno
		for(sintoma in sintomas){
			if((esAdulto && sintoma.prioridadAdulto == Prioridad.UNO) || (!esAdulto && sintoma.prioridadPediatrico == Prioridad.UNO)){
				this.prioridad = Prioridad.UNO
				this.save()
				return Prioridad.UNO
			}
		}

		//CHEQUEO SIGNOS VITALES PRIORIDAD UNO, ADULTO
		if(esAdulto && 
			(this.sistole == 'menos de 85' || this.sistole == 'más de 200'
			||
			this.diastole == 'menos de 50' || this.diastole == 'más de 110'
			||
			this.pulso == 'menos de 60' || this.pulso == 'más de 120'
			||
			this.saturacionO2 == 'menos de 95'
			||
			this.frecuenciaRespiratoria == 'menos de 12' || this.frecuenciaRespiratoria == 'más de 30'
			||
			this.temperatura == 'menos de 35' || this.temperatura == 'más de 41.0'
			||
			this.glucosa == 'menos de 50'
			)){

			this.prioridad = Prioridad.UNO
			this.save()
			return Prioridad.UNO
		}else{
			//CHEQUEO SIGNOS VITALES PRIORIDAD UNO, PEDIATRICOS MENORES DE UN ANIO
			if(this.esMenorDeUnAnio() && 
				(['menos de 60','121-130','131-140','141-150','151-165','más de 165'].contains(this.sistole)
				||
				['menos de 30','71-75', '76-80','81-85', '86-90', '91-95', '96-100','más de 100'].contains(this.diastole)
				||
				['menos de 50','50-60','61-70','71-80','más de 190'].contains(this.pulso)
				||
				this.saturacionO2 == 'menos de 95'
				||
				['menos de 10','10-15','más de 60'].contains(this.frecuenciaRespiratoria)
				||
				this.glucosa == 'menos de 50' || this.glucosa == 'más de 300'
				)){

				this.prioridad = Prioridad.UNO
				this.save()
				return Prioridad.UNO
			}else{
				//CHEQUEO SIGNOS VITALES PRIORIDAD UNO, PEDIATRICOS MENORES DE 6 ANIOS
				if(this.esMenorDe6Anios() && 
					([ 'menos de 60','60-70','151-165','más de 165'].contains(this.sistole)
					||
					['menos de 30','30-35','36-40','91-95','96-100','más de 100'].contains(this.diastole)
					||
					['menos de 50','50-60','171-180','181-190','más de 190'].contains(this.pulso)
					||
					this.saturacionO2 == 'menos de 95'
					||
					['menos de 10','51-55','56-60','más de 60'].contains(this.frecuenciaRespiratoria)
					||
					this.glucosa == 'menos de 50' || this.glucosa == 'más de 300'
					)){

					this.prioridad = Prioridad.UNO
					this.save()
					return Prioridad.UNO
				}else{
					//CHEQUEO SIGNOS VITALES PRIORIDAD UNO, PEDIATRICOS MAYORES DE 6 ANIOS
					if(!esAdulto && this.esMayorDe6Anios() && 
						(['menos de 60','60-70','71-84','más de 165'].contains(this.sistole)
						||
						['menos de 30','30-35','36-40','41-45','46-50','más de 100'].contains(this.diastole)
						||
						['menos de 50','161-170', '171-180','181-190', 'más de 190'].contains(this.pulso)
						||
						this.saturacionO2 == 'menos de 95'
						||
						['menos de 10','41-45','46-50','51-55','56-60','más de 60'].contains(this.frecuenciaRespiratoria)
						||
						this.glucosa == 'menos de 50' || this.glucosa == 'más de 300'
						)){

						this.prioridad = Prioridad.UNO
						this.save()
						return Prioridad.UNO
					}
				}
			}
		}

		//CHEQUEO SI ES PRIORIDAD 2
		for(sintoma in sintomas){
			if((esAdulto && sintoma.prioridadAdulto == Prioridad.DOS) || (!esAdulto && sintoma.prioridadPediatrico == Prioridad.DOS)){
				this.prioridad = Prioridad.DOS
				this.save()
				return Prioridad.DOS
			}
		}

		//me fijo si es prioridad 2 segun los signos vitales
		//NOTA: los unicos signos vitales que influyen en una hipotetica Prioridad 2 son la temperatura y la glucosa
		if((esAdulto && (['38.6-39.4', '39.5-41.0'].contains(this.temperatura) || this.glucosa == 'más de 300')) ||
		(this.esMenorDeTresMeses() && [
			'38.0-38.5',
			'38.6-39.4',
			'39.5-41.0',
			'más 41.0'
		].contains(this.temperatura)) ||
		(this.estaEntre3y36Meses() && ['39.5-41.0', 'más 41.0'].contains(this.temperatura))){
			this.prioridad = Prioridad.DOS
			this.save()
			return Prioridad.DOS
		}

		this.prioridad = Prioridad.TRES
		this.save()
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


	/**
	 * Retorna el tiempo de espera del paciente desde que ingresó
	 * hasta ahora
	 * @return
	 */
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
	/**
	 * Indica si el paciente esmenor de tres meses
	 * @return
	 */
	Boolean esMenorDeTresMeses(){
		return this.persona.esMenorDeTresMeses()
	}

	/**
	 * Indica si el paciente tiene entre 3 y 36 meses
	 * @return
	 */
	Boolean estaEntre3y36Meses(){
		return this.persona.estaEntre3y36Meses()
	}

	Boolean esMayorDe6Anios(){
		return this.persona.esMayorDe6Anios()
	}

	Boolean esMenorDe6Anios(){
		return this.persona.esMenorDe6Anios()
	}

	Boolean esMenorDeUnAnio(){
		return this.persona.esMenorDeUnAnio()
	}

	String getStringTipoAtencion(){
		switch(this.tipoAtencion){
		 case 1:
		 	return "Ingresa"
		 case 2:
		 	return "Consultorio externo"
		 case 3:
		 	return "Retira sin atención"
		 default:
		    return ""
	    }
	}

	String getStringSintomas(){
		String resultado = ""
		for(sintoma in this.sintomas){
			resultado += sintoma.nombre +"; "
		}
		return resultado
	}

}
