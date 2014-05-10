package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import java.text.SimpleDateFormat
import java.util.Date;

import org.codehaus.groovy.grails.web.json.JSONObject
import org.hibernate.criterion.CriteriaSpecification
import org.hibernate.criterion.Projection

@Transactional //(readOnly = true)
class PacienteController {


    static allowedMethods = [cargarPaciente: "POST"
		,cargarImpresionInicial: "POST"
		,cargarSintomas: "POST"
		,cargarSignosVitales: "POST"
		,cargarSintomas: "POST"
		,getSintomasVisuales: "POST"
		,getSignosVitales: "POST"
		,calcularPrioridad: "POST"
		,ajaxBuscarNoFinalizados: "POST"
		,finalizarPaciente: "POST"
		,cantidadDeConsultasSegunPrioridad: "POST"]
	
	
	
	
	/**
	 * Método que devuelve la cantidad de consultas según prioridad 
	 * Se filtra por fechas desde y hasta, parámetros que se reciben por JSON
	 * @return
	 */
	def cantidadDeConsultasSegunPrioridad(){
		
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
		paciente.save(flush:true)
		render request.JSON
	}
	
	

	/**
	 * calcula la prioridad (DOS o TRES) y responde un JSON
	 */
	def calcularPrioridad(){
		Paciente paciente = Paciente.get(request.JSON.id)
		Prioridad prioridad = paciente.calcularPrioridad();
		request.JSON.prioridad = prioridad
		render request.JSON
	}

	/**seleccion de paciente del listado de busqueda
	 * 
	 * @return el JSON del paciente
	 */
	@Transactional
	def cargarPaciente(){
		Persona persona = Persona.get(request.JSON.id)
		Paciente paciente = new Paciente(persona: persona, finalizado: false).save( failOnError : true )

		request.JSON.id = paciente.id
		request.JSON.nombre = persona.nombre
		request.JSON.apellido = persona.apellido
		request.JSON.fechaDeNacimiento = persona.fechaDeNacimiento.getDateString()
		request.JSON.DNI = persona.dni

		request.JSON.esAdulto = persona.esAdulto()
		 
		render request.JSON //retorna el id del paciente + los datos de la persona
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
		String sintomas = ""
		paciente.sintomas.each{
			if(sintomas.size() > 0){
				sintomas += "; "
			}
			sintomas += it.nombre
		}

		request.JSON.sintomas = sintomas

		render request.JSON
	}
	
	
	/**
	 * Este método sirve para enviar por JSON todos los síntomas visuales
	 * del paciente marcados.
	 * @return
	 */
	def getSintomasVisuales(){
		Paciente paciente = Paciente.get(request.JSON.id)
		List sintomasVisuales = new ArrayList()
		for (s in paciente.sintomas) {
			sintomasVisuales.add(s)
		}
		render sintomasVisuales as JSON
	}

	/**
	 * Este método sirve para enviar por JSON
	 * los signos vitales ya cargados del paciente
	 * @return
	 */
	def getSignosVitales(){
		Paciente paciente = Paciente.get(request.JSON.id)
		if (paciente.presionArterial != null) request.JSON.presion = paciente.presionArterial
		if (paciente.temperatura != null) request.JSON.temperatura = paciente.temperatura
		if (paciente.pulso != null) request.JSON.pulso = paciente.pulso
		if (paciente.frecuenciaRespiratoria != null) request.JSON.frecuencia = paciente.frecuenciaRespiratoria

		render request.JSON
	}

	@Transactional
	def cargarSintomas(){
		Paciente paciente = Paciente.get(request.JSON.id)
		request.JSON.sintomas.each {
			paciente.addToSintomas(Sintoma.get(it.id))
		}

		paciente.save()

		this.enviarRespuesta(paciente)
	}

	def enviarRespuesta(Paciente paciente){
		if(paciente.esPrioridadUno()){
			paciente.prioridad = Prioridad.UNO
			paciente.save(flush: true)//flush:true significa que hace el commit a la base inmediatamente
			request.JSON.prioridad = "UNO"
		}

		request.JSON.nombre = paciente.persona.nombre
		request.JSON.apellido = paciente.persona.apellido
		request.JSON.fechaDeNacimiento = paciente.persona.fechaDeNacimiento.getDateString()
		request.JSON.dni = paciente.persona.dni
		request.JSON.direccion = paciente.persona.direccion
		request.JSON.telefono = paciente.persona.telefono
		request.JSON.obraSocial = paciente.persona.obraSocial
		request.JSON.nroAfiliado = paciente.persona.nroAfiliado

		String sintomas = ""
		paciente.sintomas.each{
			if(sintomas.size() > 0){
				sintomas += "; "
			}
			sintomas += it.nombre
		}

		request.JSON.sintomas = sintomas
		request.JSON.fecha = paciente.fechaHoraIngreso.getDateTimeString()

		render request.JSON
	}


	@Transactional
	def cargarSignosVitales(){
		Paciente paciente = Paciente.get(request.JSON.id)
		if (request.JSON.presionArterial != null) paciente.presionArterial = request.JSON.presionArterial
		if (request.JSON.pulso != null) paciente.pulso = request.JSON.pulso
		if (request.JSON.frecuenciaRespiratoria != null) paciente.frecuenciaRespiratoria = request.JSON.frecuenciaRespiratoria
		if (request.JSON.temperatura != null) paciente.temperatura = request.JSON.temperatura

		paciente.save()

		if (paciente.esPrioridadUno()){
			paciente.prioridad = Prioridad.UNO
			paciente.save(flush:true)
		}

		this.enviarRespuesta(paciente)
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

	

	


	def index(Integer max) {
		params.max = Math.min(max ?: 10, 100)
		respond Paciente.list(params), model:[pacienteInstanceCount: Paciente.count()]
	}

	def show(Paciente pacienteInstance) {
		respond pacienteInstance
	}

	def create() {
		respond new Paciente(params)
	}
	
	
	String traerPrioridad (Prioridad p){
		if (p == Prioridad.UNO) return "Prioridad UNO"
		if (p == Prioridad.DOS) return "Prioridad DOS"
		if (p == Prioridad.TRES) return "Prioridad TRES"
		if (p == null) return "No se ha calculado"
	}
	
	def  calcularEdad(String fecha){
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
	

}
