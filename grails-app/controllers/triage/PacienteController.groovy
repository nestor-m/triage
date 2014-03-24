package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

@Transactional(readOnly = true)
class PacienteController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"
		,cargarPaciente: "POST"
		,cargarImpresionInicial: "POST"
		,cargarSintomas: "POST"
		,cargarSignosVitales: "POST"]
	
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
	
	/**submit de la impresion inicial
	 * 
	 * @return el JSON del paciente
	 */
	@Transactional
	def cargarImpresionInicial(){
		Paciente paciente = Paciente.get(request.JSON.id)//recupero al paciente por el id
		//me llega la lista de sintomas cargados en la impresion de inicial		
		request.JSON.sintomas.each {
			paciente.addToSintomas(Sintoma.get(it.id))
		}
		
		paciente.save()
		
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
		paciente.presionArterial = request.JSON.presionArterial
		paciente.pulso = request.JSON.pulso
		paciente.frecuenciaRespiratoria = request.JSON.frecuenciaRespiratoria
		paciente.temperatura = request.JSON.temperatura
		
		paciente.save(failOnError:true)
	}
	
	@Transactional
	def cargarSintomas(){
		Paciente paciente = Paciente.get(request.JSON.id)
		request.JSON.sintomas.each {
			paciente.addToSintomas(it)
		}
		
		paciente.save()
		
		if (paciente.esPrioridadUno()){
			paciente.prioridad = Prioridad.UNO
			paciente.save(flush:true)
		}
		
		render paciente as JSON
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

    @Transactional
    def save(Paciente pacienteInstance) {
        if (pacienteInstance == null) {
            notFound()
            return
        }

        if (pacienteInstance.hasErrors()) {
            respond pacienteInstance.errors, view:'create'
            return
        }

        pacienteInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.created.message', args: [message(code: 'pacienteInstance.label', default: 'Paciente'), pacienteInstance.id])
                redirect pacienteInstance
            }
            '*' { respond pacienteInstance, [status: CREATED] }
        }
    }

    def edit(Paciente pacienteInstance) {
        respond pacienteInstance
    }

    @Transactional
    def update(Paciente pacienteInstance) {
        if (pacienteInstance == null) {
            notFound()
            return
        }

        if (pacienteInstance.hasErrors()) {
            respond pacienteInstance.errors, view:'edit'
            return
        }

        pacienteInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Paciente.label', default: 'Paciente'), pacienteInstance.id])
                redirect pacienteInstance
            }
            '*'{ respond pacienteInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Paciente pacienteInstance) {

        if (pacienteInstance == null) {
            notFound()
            return
        }

        pacienteInstance.delete flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Paciente.label', default: 'Paciente'), pacienteInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'pacienteInstance.label', default: 'Paciente'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
