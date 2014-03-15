package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional//(readOnly = true)
class SintomaController {

	static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE",
		ajaxListVisuales: "GET", traerSintomas:"POST"]
	
	/**submit del formulario del listado de busqueda de pacientes
	 *
	 */
	def traerSintomas() {
		String sintoma = request.JSON.sintoma
		String tipoDeSintoma = request.JSON.tipoDeSintoma
		
		List sintomas = Sintoma.executeQuery("select s.id,s.nombre,t.nombre from Sintoma s, TipoDeSintoma t where s.tipoDeSintoma = t.id " +
			                                  (sintoma != null ? "and s.nombre like '" + sintoma.toUpperCase() + "%'" : ' ') + 
											  (tipoDeSintoma != null ? "and t.nombre like '" + tipoDeSintoma.toUpperCase() + "%'" : ''))
		List resultado = new ArrayList()
		for(s in sintomas){
			resultado.add(new JSONObject('{"id":' + s[0] +
				                         ',"nombre":"' + s[1] + '"' +
										 ',"tipoDeSintoma":"' + s[2] + '"}'))			
		}
		
		render resultado as JSON
		return resultado
	}
   
   def ajaxListVisuales() {
	   def query = Sintoma.where{
		   tipoDeSintoma.nombre == "IMPRESION INICIAL"
	   }
   
	   //CON CRITERIA
//	   def criteria = Sintoma.createCriteria()
//	   def results = criteria.list {
//		   tipoDeSintoma {
//			   eq('nombre', 'IMPRESION INICIAL')
//		   }
//	   }

	   render query.list() as JSON
   }
   
   
   @Transactional
   def ajaxSave(){
	   def Sintoma = new Sintoma(
		   nombre: request.JSON.nombre,
		   prioridad: request.JSON.prioridad,
		   tipoDeSintoma: request.JSON.tipoDeSintoma
		   ). save(failOnError: true)
   }
	
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Sintoma.list(params), model:[sintomaInstanceCount: Sintoma.count()]
    }

    def show(Sintoma sintomaInstance) {
        respond sintomaInstance
    }

    def create() {
        respond new Sintoma(params)
    }

    @Transactional
    def save(Sintoma sintomaInstance) {
        if (sintomaInstance == null) {
            notFound()
            return
        }

        if (sintomaInstance.hasErrors()) {
            respond sintomaInstance.errors, view:'create'
            return
        }

        sintomaInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.created.message', args: [message(code: 'sintomaInstance.label', default: 'Sintoma'), sintomaInstance.id])
                redirect sintomaInstance
            }
            '*' { respond sintomaInstance, [status: CREATED] }
        }
    }

    def edit(Sintoma sintomaInstance) {
        respond sintomaInstance
    }

    @Transactional
    def update(Sintoma sintomaInstance) {
        if (sintomaInstance == null) {
            notFound()
            return
        }

        if (sintomaInstance.hasErrors()) {
            respond sintomaInstance.errors, view:'edit'
            return
        }

        sintomaInstance.save flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'Sintoma.label', default: 'Sintoma'), sintomaInstance.id])
                redirect sintomaInstance
            }
            '*'{ respond sintomaInstance, [status: OK] }
        }
    }

    @Transactional
    def delete(Sintoma sintomaInstance) {

        if (sintomaInstance == null) {
            notFound()
            return
        }

        sintomaInstance.delete flush:true

        request.withFormat {
            form {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'Sintoma.label', default: 'Sintoma'), sintomaInstance.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'sintomaInstance.label', default: 'Sintoma'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
