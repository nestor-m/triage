package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SintomaController {

	static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE",
		ajaxListVisuales: "GET", ajaxList: "GET"]
   
   
   def ajaxListVisuales() {
	   render Sintoma.findAll( "from Sintoma s" ) as JSON
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
