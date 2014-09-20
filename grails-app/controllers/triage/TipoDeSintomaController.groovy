package triage

import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional
import grails.validation.ValidationException

import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional //(readOnly = true)
class TipoDeSintomaController extends LoginController{

	static allowedMethods = [traerTiposDeSintomas:"POST",submitTipoDeSintomaForm:"POST"]

   def beforeInterceptor = [action: this.&auth, only: 'traerTiposDeSintomas']
// defined with private scope, so it's not considered an action
private auth() {
    if (!session.user) {
        redirect(action: 'login')
        return false
    }
}


	/**
	* Retorna todos los tipos de sintomas
	*/
	def traerTiposDeSintomas(){
		if(request.JSON.tipoDeSintoma != null && request.JSON.tipoDeSintoma !=''){
			render TipoDeSintoma.findAll("from TipoDeSintoma as t where t.nombre like ?", [request.JSON.tipoDeSintoma.toUpperCase()+'%']) as JSON
		}else{
			render TipoDeSintoma.findAll() as JSON
		}		
	}
	

	/**
	* inserta o actualiza un tipo de sintoma
	*/
	@Transactional
	def submitTipoDeSintomaForm(){   
      if(session.user.rol != Rol.ADMINISTRADOR){//valido que el usuario tenga rol ADMINISTRADOR
         response.status = 401
         render 'Usted no tiene permiso para crear o actualizar un discriminante' //respondo algo para que no me tire error 404
         return
      }

		def id = request.JSON.id
		def nombre = request.JSON.nombre.toUpperCase()

		//valido que no haya ningun campo faltante
		if(nombre == null || nombre == ''){
			response.status = 500
			render 'No se enviaron todos los campos necesarios'
			return
		}

		if(id == null){//si el id esta en null es un tipo de sintoma nuevo
			try {
				new TipoDeSintoma(nombre: nombre).save(failOnError : true)   
			}catch(ValidationException ve) {
				response.status = 500
				render 'Error. Ya existe un discriminante con el nombre ' + nombre
				return
		   }
			render 'Discriminante ' + nombre + ' cargado con éxito'
		}else{//si me llega el id es porque es un update
			def tipoDeSintoma = TipoDeSintoma.get(id)
			tipoDeSintoma.nombre = nombre
			try{
				tipoDeSintoma.save(failOnError : true)
				render 'Discriminante ' + nombre + ' actualizado con éxito'
			}catch(ValidationException ve){
				response.status = 500
				render 'Error. Ya existe un discriminante con el nombre ' + nombre
			}
		}	
	}
   
}
