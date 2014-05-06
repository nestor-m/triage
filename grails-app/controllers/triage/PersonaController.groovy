package triage



import static org.springframework.http.HttpStatus.*

import java.net.Authenticator.RequestorType;

import org.codehaus.groovy.grails.web.json.JSONObject;

import grails.converters.JSON
import grails.transaction.Transactional

@Transactional //(readOnly = true) esto me hizo romperme la cabeza durante unas cuantas horas :(
class PersonaController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE", ajaxList: "GET", ajaxSave: "POST",
								ajaxBuscar: "POST", ajaxBuscarNoFinalizados: "POST"]

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

	/**
	 * Submit del formulario de alta de persona
	 * @return
	 */
	@Transactional
	def ajaxSave() {
		//validacion para request desde herramientas como curl
		if(request.JSON.nombre == null && request.JSON.apellido && request.JSON.fechaDeNacimiento){
			return
		}

		def persona = new Persona(
			nombre : request.JSON.nombre.toUpperCase(),
			apellido : request.JSON.apellido.toUpperCase(),
			fechaDeNacimiento : new Date(request.JSON.fechaDeNacimiento.replaceAll("-","/")),
			dni : request.JSON.dni,
			direccion : request.JSON.direccion,
			telefono : request.JSON.telefono,
			obraSocial : request.JSON.obraSocial,
			nroAfiliado : request.JSON.nroAfiliado
		).save( failOnError : true, flush:true )
		
		Paciente paciente = new Paciente(persona: persona,fechaHoraIngreso: new Date(), finalizado: false).save( failOnError : true )
		
		
		request.JSON.id = paciente.id
		request.JSON.nombre = persona.nombre
		request.JSON.apellido = persona.apellido
		request.JSON.fechaDeNacimiento = persona.fechaDeNacimiento.getDateString()
		request.JSON.DNI = persona.dni
		 
		render request.JSON //retorna el id del paciente + los datos de la persona
	}
	
	def ajaxList() {
		render Persona.findAll( "from Persona p" ) as JSON
	}
	
	/**submit del formulario del listado de busqueda de pacientes
	 *  
	 */
	def ajaxBuscar() {		
	//CON CRITERIA				
		List resultado = Persona.withCriteria {
			if (request.JSON.dni != '' && request.JSON.dni != null){
				ilike("dni",request.JSON.dni+"%") //ilike es un like case insensitive 
			}
			if (request.JSON.apellido != '' && request.JSON.apellido != null){
				ilike("apellido",request.JSON.apellido+"%")
			}
			if (request.JSON.nombre != '' && request.JSON.nombre != null){
				ilike("nombre",request.JSON.nombre+"%")
			}
			if (request.JSON.fechaDeNacimiento  != '' && request.JSON.fechaDeNacimiento  != null){
				eq("fechaDeNacimiento",new Date(request.JSON.fechaDeNacimiento.replaceAll("-","/")))
			}
		}		
		render resultado as JSON		
		return resultado	
	}	
	

	
			
}
