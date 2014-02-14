package triage



import static org.springframework.http.HttpStatus.*

import java.net.Authenticator.RequestorType;

import grails.converters.JSON
import grails.transaction.Transactional

@Transactional //(readOnly = true) esto me hizo romperme la cabeza durante unas cuantas horas :(
class PersonaController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE", ajaxList: "GET", ajaxSave: "POST"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Persona.list(params), model:[personaInstanceCount: Persona.count()]
    }

    def show(Persona personaInstance) {
        respond personaInstance
    }

    def create() {
        respond new Persona(params)
    }

	@Transactional
	def ajaxSave() {
		def persona = new Persona(
			nombre : request.JSON.nombre,
			apellido : request.JSON.apellido,
			fechaDeNacimiento : request.JSON.fechaDeNacimiento,
			dni : request.JSON.dni,
			direccion : request.JSON.direccion,
			telefono : request.JSON.telefono,
			obraSocial : request.JSON.obraSocial,
			nroAfiliado : request.JSON.nroAfiliado
		).save( failOnError : true )
		
		new Paciente(
			persona : persona,
			fechaHoraIngreso: new Date()
			).save( failOnError : true )
			
		//this.ajaxList()
	}
	
	def ajaxList() {
		render Persona.findAll( "from Persona p" ) as JSON
	}
			
    @Transactional
    def save(Persona personaInstance) {
        if (personaInstance == null) {
            notFound()
            return
        }

        if (personaInstance.hasErrors()) {
            respond personaInstance.errors, view:'create'
            return
        }

        personaInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.created.message', args: [message(code: 'personaInstance.label', default: 'Persona'), personaInstance.id])
                redirect personaInstance
            }
            '*' { respond personaInstance, [status: CREATED] }
        }
    }

    def edit(Persona personaInstance) {
        respond personaInstance
    }

    @Transactional
    def update(Persona personaInstance) {
        if (personaInstance == null) {
            notFound()
            return
        }

        if (personaInstance.hasErrors()) {
            respond personaInstance.errors, view:'edit'
            return
        }

        personaInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Persona.label', default: 'Persona'), personaInstance.id])
                redirect personaInstance
            }
            '*'{ respond personaInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Persona personaInstance) {

        if (personaInstance == null) {
            notFound()
            return
        }

        personaInstance.delete flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Persona.label', default: 'Persona'), personaInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'personaInstance.label', default: 'Persona'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
