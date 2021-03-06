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


import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import java.text.SimpleDateFormat
import java.util.Date;

import org.codehaus.groovy.grails.web.json.JSONObject
import org.hibernate.criterion.CriteriaSpecification
import org.hibernate.criterion.Projection

import java.lang.Exception

@Transactional //(readOnly = true)
class PacienteController extends LoginController{

	//esta variable restringe con que metodos HTTP pueden ser llamados los metodos de la clase.
	//Si no se especifica, los metodos de la clase pueden ser invocados por cualquier metodo HTTP
	static allowedMethods = [cargarPaciente: "POST"
		,cargarImpresionInicial: "POST"
		,cargarSintomasYResponder: "POST"
		,cargarSignosVitalesYResponder: "POST"
		,cargarSintomas: "POST"
		,getSignosVitales: "POST"
		,getSintomas: "POST"
		,finalizarTriage: "POST"
		,ajaxBuscarNoFinalizados: "POST"
		,finalizarPaciente: "POST"
		,cantidadDeConsultasSegunPrioridad: "POST"
		,cargarPacienteEnEspera: "POST"
		,tiempoEsperaSegunPrioridad: "POST"
		,traerDatosPaciente: "POST"
		,getRegistroDiario: "POST"]


	/**
	 * Método que devuelve la cantidad de consultas según prioridad 
	 * Se filtra por fechas desde y hasta, parámetros que se reciben por JSON
	 * @return
	 */
	def cantidadDeConsultasSegunPrioridad(){
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy")
		Date fechaDesde = sdf.parse(request.JSON.fechaDesde)
		Date fechaHasta = sdf.parse(request.JSON.fechaHasta)
		//Se agrega un día porque el date con horario cuenta sólo hasta las 00 hs..
		fechaHasta = agregarDias(fechaHasta, 1)
		SimpleDateFormat output = new SimpleDateFormat("yyyy-MM-dd")
		String formattedFechaDesde = output.format(fechaDesde)
		String formattedFechaHasta = output.format(fechaHasta)

		List prioridades = Paciente.executeQuery("select prioridad,count(*) as cantidad "+
				"FROM Paciente  "+
				" WHERE fecha_hora_ingreso between '" + formattedFechaDesde +
				"' and '" + formattedFechaHasta + "' and prioridad is not null group by prioridad order by cantidad")
		List resultado = new ArrayList()
		for (p in prioridades){
			resultado.add(new JSONObject('{"prioridad":' + p[0] +
					',"cantidad":"' + p[1] + '"}'))
		}

		render resultado as JSON
		return resultado
	}


	/**
	 * Consulta que retorna los tiempos de espera según prioridad
	 * en un determinado período de tiempo que viene por parámetro
	 * @return
	 */
	def tiempoEsperaSegunPrioridad(){
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy")
		Date fechaDesde = sdf.parse(request.JSON.fechaDesde)
		Date fechaHasta = sdf.parse(request.JSON.fechaHasta)
		//Se agrega un día porque el date con horario cuenta sólo hasta las 00 hs..
		fechaHasta = agregarDias(fechaHasta, 1)
		SimpleDateFormat output = new SimpleDateFormat("yyyy-MM-dd")
		String formattedFechaDesde = output.format(fechaDesde)
		String formattedFechaHasta = output.format(fechaHasta)


		List prioridades;
		try{			
			//POSTGRES
			prioridades = Paciente.executeQuery("SELECT  prioridad, "+
				"coalesce(((sum( (DATE_PART('day', fecha_hora_atencion - fecha_hora_ingreso) * 24 + "+
				   "DATE_PART('hour', fecha_hora_atencion - fecha_hora_ingreso)) * 60 + "+
                   "DATE_PART('minute', fecha_hora_atencion - fecha_hora_ingreso) ) ) )/count(*),0) as tiempo "+	
				"FROM Paciente	"+ 
				"WHERE fecha_hora_ingreso between '" + formattedFechaDesde +
				"' and '" + formattedFechaHasta + 
				"'and finalizado = true group by prioridad")
		}catch(Exception e){//si tira excepcion porque no conoce la funcion DATE_PART
			//H2
			prioridades = Paciente.executeQuery("SELECT  prioridad, "+
				"coalesce(((sum(datediff(ss, fecha_hora_ingreso, fecha_hora_atencion)) / 60) )/count(*),0) as tiempo "+	
				"FROM Paciente	"+ 
				"WHERE fecha_hora_ingreso between '" + formattedFechaDesde +
				"' and '" + formattedFechaHasta + 
				"'and finalizado = true group by prioridad")
		}
		
		List resultado = new ArrayList()
		for (p in prioridades){
			resultado.add(new JSONObject('{"prioridad":' + p[0] +
					',"tiempo":"' + p[1] + '"}'))
		}
		
		render resultado as JSON
		return resultado
	}


	/*
	 *Click boton Finalizar triage. Carga la impresion visual, los sintomas y los signos vitales
	 */
	@Transactional
	def finalizarTriage(){
		Paciente paciente = Paciente.get(request.JSON.id)
		request.JSON.sintomasImpresionVisual.each {
			paciente.addToSintomas(Sintoma.get(it.id))
		}
		this.cargarSintomas(paciente)
		this.cargarSignosVitales(paciente)
		request.JSON.prioridad = paciente.calcularPrioridad()
		this.enviarRespuesta(paciente)
	}


	/**
	 * Método que marca el paciente como finalizado.
	 * Levanta del JSON el id paciente y el tipo de finalización (ingresa, consultorio externo, se retira).
	 * @return
	 */
	@Transactional
	def finalizarPaciente(){
		Integer tipoFin = request.JSON.tipoFin
		Paciente paciente = Paciente.get(request.JSON.id)
		paciente.tipoAtencion = tipoFin
		paciente.finalizado = true
		paciente.fechaHoraAtencion = new Date();
		paciente.save(flush:true)
		render request.JSON
	}


	/**
	 * calcula la prioridad (DOS o TRES) y responde un JSON
	 */
	@Transactional
	def calcularPrioridad(){
		Paciente paciente = Paciente.get(request.JSON.id)
		paciente.calcularPrioridad()
		this.enviarRespuesta(paciente)
	}

	/**seleccion de paciente del listado de busqueda
	 * 
	 * @return el JSON del paciente
	 */
	@Transactional
	def cargarPaciente(){
		Persona persona = Persona.get(request.JSON.id)
		Paciente paciente = Paciente.withCriteria(uniqueResult: true) {//chequeo si el paciente ya esta cargado
			eq('finalizado', false)
			eq('persona', persona)
		}

		//esto hace lo mismo que withCriteria pero no es soportado por los test de Grails
		//Paciente paciente = Paciente.find("from Paciente where finalizado='FALSE' and persona=:persona", [persona: persona])

		//los test de Grails hacian una cosa rara, me devolvia un paciente con todo en null
		//entonces me vi obligado a agregar la condicion || paciente.id == null)
		if(paciente == null || paciente.id == null){//solo cargo el paciente si no esta cargado
			paciente = new Paciente(persona: persona).save( failOnError : true )
		}	

		request.JSON.id = paciente.id //piso el id de la persona con el id del paciente
		this.cargarPacienteEnEspera()
	}

	/**
	 * Carga un paciente que ya estaba en espera
	 * @return
	 */
	@Transactional
	def cargarPacienteEnEspera(){
		Paciente paciente = Paciente.get(request.JSON.id)
		request.JSON.id = paciente.id
		request.JSON.nombre = paciente.persona.nombre
		request.JSON.apellido = paciente.persona.apellido
		request.JSON.fechaDeNacimiento = paciente.persona.fechaDeNacimiento.getDateString()
		request.JSON.DNI = paciente.persona.dni
		request.JSON.esAdulto = paciente.esAdulto()
		if(!request.JSON.esAdulto){//es pediatrico
			request.JSON.categoriaPediatrico = paciente.persona.getCategoriaPediatrico()
		}

		render request.JSON
	}
	
	/**
	 * Listo todos los síntomas del paciente.
	 * @return
	 */
	def getSintomas(){
		Paciente paciente = Paciente.get(request.JSON.id)
		List sintomas = new ArrayList()
		for (s in paciente.sintomas) {
			sintomas.add(s)
		}
		render sintomas as JSON
	}

	/**
	 * Este método sirve para enviar por JSON
	 * los signos vitales ya cargados del paciente
	 * @return
	 */
	def getSignosVitales(){
		Paciente paciente = Paciente.get(request.JSON.id)
		if (paciente.sistole != null) request.JSON.sistole = paciente.sistole
		if (paciente.diastole != null) request.JSON.diastole = paciente.diastole
		if (paciente.temperatura != null) request.JSON.temperatura = paciente.temperatura
		if (paciente.pulso != null) request.JSON.pulso = paciente.pulso
		if (paciente.frecuenciaRespiratoria != null) request.JSON.frecuenciaRespiratoria = paciente.frecuenciaRespiratoria
		if (paciente.glucosa != null) request.JSON.glucosa = paciente.glucosa
		if (paciente.saturacionO2 != null) request.JSON.saturacionO2 = paciente.saturacionO2

		render request.JSON
	}

	@Transactional
	def cargarSintomasYResponder(){
		Paciente paciente = Paciente.get(request.JSON.id)
		this.cargarSintomas(paciente)
		this.enviarRespuesta(paciente)
	}

	def cargarSintomas(Paciente paciente){
		/*request.JSON.sintomas.each {
		 paciente.addToSintomas(Sintoma.get(it.id))
		 }*/
		List resultado = new ArrayList()
		request.JSON.sintomas.each {
			resultado.add(Sintoma.get(it.id))
		}
		paciente.sintomas = resultado //piso los sintomas agregados anteriormente. Con esto evito que se carguen repetidos y
		//cubro la posibilidad de poder borrar sintomas cargados anteriormente

		if(request.JSON.esPrioridadUno){
			paciente.prioridad = Prioridad.UNO
			paciente.save()
		}else{
			paciente.calcularPrioridad()
		}
	}

	def traerDatosPaciente(){
		this.enviarRespuesta(Paciente.get(request.JSON.id))
	}

	/**
	 * 
	 * @param paciente
	 * @return
	 */
	def enviarRespuesta(Paciente paciente){
		request.JSON.nombre = paciente.persona.nombre
		request.JSON.apellido = paciente.persona.apellido
		request.JSON.fechaDeNacimiento = paciente.persona.fechaDeNacimiento.getDateString()
		request.JSON.dni = paciente.persona.dni
		request.JSON.direccion = paciente.persona.direccion
		request.JSON.telefono = paciente.persona.telefono
		request.JSON.obraSocial = paciente.persona.obraSocial
		request.JSON.nroAfiliado = paciente.persona.nroAfiliado

		String sintomas = "" //la variable tiene el mismo nombre que el atributo?
		paciente.sintomas.each{
			if(sintomas.size() > 0){
				sintomas += "; "
			}
			sintomas += it.nombre
		}

		sintomas != ""?request.JSON.sintomas = sintomas:request.JSON.remove("sintomas")

		request.JSON.fecha = paciente.fechaHoraIngreso.getDateTimeString()
		request.JSON.sistole = paciente.sistole
		request.JSON.diastole = paciente.diastole
		request.JSON.pulso = paciente.pulso
		request.JSON.frecuenciaRespiratoria = paciente.frecuenciaRespiratoria
		request.JSON.temperatura = paciente.temperatura
		request.JSON.saturacionO2 = paciente.saturacionO2
		request.JSON.glucosa = paciente.glucosa

		request.JSON.prioridad = paciente.prioridad

		render request.JSON
	}

	/**
	 * 
	 * @return
	 */
	@Transactional
	def cargarSignosVitalesYResponder(){
		Paciente paciente = Paciente.get(request.JSON.id)
		this.cargarSignosVitales(paciente)
		this.enviarRespuesta(paciente)
	}

	/**
	 * Carga l	os signos vitales del paciente 
	 * (Los datos viene por JSON)
	 * @param paciente
	 * @return
	 */
	def cargarSignosVitales(Paciente paciente){
		if (request.JSON.sistole != null) paciente.sistole = request.JSON.sistole
		if (request.JSON.diastole != null) paciente.diastole = request.JSON.diastole
		if (request.JSON.pulso != null) paciente.pulso = request.JSON.pulso
		if (request.JSON.frecuenciaRespiratoria != null) paciente.frecuenciaRespiratoria = request.JSON.frecuenciaRespiratoria
		if (request.JSON.temperatura != null) paciente.temperatura = request.JSON.temperatura
		if (request.JSON.saturacionO2 != null) paciente.saturacionO2 = request.JSON.saturacionO2
		if (request.JSON.glucosa != null) paciente.glucosa = request.JSON.glucosa

		if(request.JSON.esPrioridadUno){
			paciente.prioridad = Prioridad.UNO
			paciente.save()
		}else{
			paciente.calcularPrioridad()
		}
	}

	/**
	 * Método que devuelve una lista en JSON con los datos de los pacientes no finalizados
	 * @return
	 */
	def ajaxBuscarNoFinalizados() {
		String nombre = request.JSON.nombre
		String apellido = request.JSON.apellido

		List pacientes = Paciente.executeQuery("select pac.id, per.nombre, per.apellido, per.dni, "+
				" per.fechaDeNacimiento, pac.fechaHoraIngreso, pac.prioridad"+
				" from Paciente pac, Persona per where pac.finalizado = false and "+
				"pac.persona = per.id" +
				(nombre != null ? " and per.nombre like '" + nombre.toUpperCase() + "%'" : ' ') +
				(apellido != null ? " and per.apellido like '" + apellido.toUpperCase() + "%'" : ' '))
		List resultado = new ArrayList()
		for(p in pacientes){
			def duration
			use(groovy.time.TimeCategory) {
				Date ahora = new Date()
				duration = ahora - p[5]
				return duration
			}
			String fechaNac = new SimpleDateFormat("dd-MM-yyyy").format(p[4]);
			Integer edad = calcularEdad(fechaNac)
			String prio = traerPrioridad(p[6])
			resultado.add(new JSONObject('{"id":' + p[0] +
					',"nombre":"' + p[1] +" "+ p[2] + '"' +
					',"demora":"' + duration + '"' +
					',"prioridad":"' + prio + '"' +
					',"edad":"' + edad + '"}'))
		}


		render resultado as JSON
		return resultado
	}

	/**
	 * Método que devuelve un String con la prioridad actual de un paciente.
	 * @param p
	 * @return
	 */
	String traerPrioridad (Prioridad p){
		if (p == Prioridad.UNO) return "Prioridad UNO"
		if (p == Prioridad.DOS) return "Prioridad DOS"
		if (p == Prioridad.TRES) return "Prioridad TRES"
		if (p == null) return "No se ha calculado"
	}


	/**
	 * Método para agregar días a una fecha
	 * @param fecha
	 * @param dia
	 * @return la misma fecha con día de más
	 */
	private agregarDias(Date fecha,int dia){//agrego el private para que no me tire un warning por recibir un Date por parametro
		Calendar cal = new GregorianCalendar()
		cal.setLenient(false)
		cal.setTime(fecha)

		cal.add(Calendar.DAY_OF_MONTH, dia)

		return cal.getTime()
	}

	def calcularEdad(String fecha){
		Date fechaNac=null
		try {
			/**Se puede cambiar la mascara por el formato de la fecha
			 que se quiera recibir, por ejemplo año mes día "yyyy-MM-dd"
			 en este caso es día mes año*/
			fechaNac = new SimpleDateFormat("dd-MM-yyyy").parse(fecha)
		} catch (Exception ex) {
			System.out.println("Error:"+ex)
		}
		Calendar fechaNacimiento = Calendar.getInstance()
		//Se crea un objeto con la fecha actual
		Calendar fechaActual = Calendar.getInstance()
		//Se asigna la fecha recibida a la fecha de nacimiento.
		fechaNacimiento.setTime(fechaNac)
		//Se restan la fecha actual y la fecha de nacimiento
		int año = fechaActual.get(Calendar.YEAR)- fechaNacimiento.get(Calendar.YEAR)
		int mes =fechaActual.get(Calendar.MONTH)- fechaNacimiento.get(Calendar.MONTH)
		int dia = fechaActual.get(Calendar.DATE)- fechaNacimiento.get(Calendar.DATE)
		//Se ajusta el año dependiendo el mes y el día
		if(mes<0 || (mes==0 && dia<0)){
			año--
		}
		//Regresa la edad en base a la fecha de nacimiento
		return año
	}

	def getRegistroDiario(){		
		Date date = new SimpleDateFormat("dd/MM/yyyy").parse(request.JSON.fecha)
		List pacientes = Paciente.findAllByFechaHoraIngresoBetween(date,date+1)				
		List resultado = new ArrayList()
		for (paciente in pacientes){
			String prioridad = paciente.prioridad==null?" ":paciente.prioridad
			String dni = paciente.persona.dni==null?" ":paciente.persona.dni

			resultado.add(new JSONObject('{"id":"' + paciente.id + '"' +
			',"nombre":"' + paciente.persona.nombre + " " + paciente.persona.apellido + '"' +
			',"dni":"' + dni + '"' +
			',"edad":"' + paciente.persona.getDescripcionEdad() + '"' +					
			',"prioridad":"' + prioridad + '"' +
			',"tipoAtencion":"' + paciente.getStringTipoAtencion() + '"' +
			',"sintomas":"' + paciente.getStringSintomas() + '"}'))
		}
		render resultado as JSON	
	}


}
