package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

@Transactional //(readOnly = true)
class PacienteController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"
		,cargarPaciente: "POST"
		,cargarImpresionInicial: "POST"
		,cargarSintomas: "POST"
		,cargarSignosVitales: "POST"
		,cargarSintomas: "POST"
		,getSintomasVisuales: "POST"
		,getSignosVitales: "POST"]
	
	/**seleccion de paciente del listado de busqueda
	 * 
	 * @return el JSON del paciente
	 */
	@Transactional
	def cargarPaciente(){
		Persona persona = Persona.get(request.JSON.id)
		Paciente paciente = new Paciente(persona: persona).save( failOnError : true )
		
		request.JSON.id = paciente.id
		request.JSON.nombre = persona.nombre
		request.JSON.apellido = persona.apellido
		request.JSON.fechaDeNacimiento = persona.fechaDeNacimiento.getDateString()
		request.JSON.DNI = persona.dni
		 
		render request.JSON //retorna el id del paciente + los datos de la persona
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
//		request.JSON.sint = paciente.pulso < 40;
		
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

}
