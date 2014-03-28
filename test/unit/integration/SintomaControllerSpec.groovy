package integration



import grails.test.mixin.*
import spock.lang.*
import triage.Prioridad
import triage.Sintoma
import triage.SintomaController
import triage.TipoDeSintoma

@TestFor(SintomaController)
@Mock(Sintoma)
class SintomaControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        params["nombre"] = 'palidez'
		params["prioridad"]  = Prioridad.UNO
		params["tipoDeSintoma"] = new TipoDeSintoma(nombre:"IMPRESION INICIAL") //TipoDeSintoma.IMPRESION_INICIAL
    }

    void "Test the index action returns the correct model"() {

        when:"The index action is executed"
            controller.index()

        then:"The model is correct"
            !model.sintomaInstanceList
            model.sintomaInstanceCount == 0
    }

    void "Test the create action returns the correct model"() {
        when:"The create action is executed"
            controller.create()

        then:"The model is correctly created"
            model.sintomaInstance!= null
    }

    void "Test the save action correctly persists an instance"() {

        when:"The save action is executed with an invalid instance"
            def sintoma = new Sintoma()
            sintoma.validate()
            controller.save(sintoma)

        then:"The create view is rendered again with the correct model"
            model.sintomaInstance!= null
            view == 'create'

        when:"The save action is executed with a valid instance"
            response.reset()
            populateValidParams(params)
            sintoma = new Sintoma(params)

            controller.save(sintoma)

        then:"A redirect is issued to the show action"
            response.redirectedUrl == '/sintoma/show/1'
            controller.flash.message != null
            Sintoma.count() == 1
    }

    void "Test that the show action returns the correct model"() {
        when:"The show action is executed with a null domain"
            controller.show(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the show action"
            populateValidParams(params)
            def sintoma = new Sintoma(params)
            controller.show(sintoma)

        then:"A model is populated containing the domain instance"
            model.sintomaInstance == sintoma
    }

    void "Test that the edit action returns the correct model"() {
        when:"The edit action is executed with a null domain"
            controller.edit(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the edit action"
            populateValidParams(params)
            def sintoma = new Sintoma(params)
            controller.edit(sintoma)

        then:"A model is populated containing the domain instance"
            model.sintomaInstance == sintoma
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when:"Update is called for a domain instance that doesn't exist"
            controller.update(null)

        then:"A 404 error is returned"
            response.redirectedUrl == '/sintoma/index'
            flash.message != null


        when:"An invalid domain instance is passed to the update action"
            response.reset()
            def sintoma = new Sintoma()
            sintoma.validate()
            controller.update(sintoma)

        then:"The edit view is rendered again with the invalid instance"
            view == 'edit'
            model.sintomaInstance == sintoma

        when:"A valid domain instance is passed to the update action"
            response.reset()
            populateValidParams(params)
            sintoma = new Sintoma(params).save(flush: true)
            controller.update(sintoma)

        then:"A redirect is issues to the show action"
            response.redirectedUrl == "/sintoma/show/$sintoma.id"
            flash.message != null
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when:"The delete action is called for a null instance"
            controller.delete(null)

        then:"A 404 is returned"
            response.redirectedUrl == '/sintoma/index'
            flash.message != null

        when:"A domain instance is created"
            response.reset()
            populateValidParams(params)
            def sintoma = new Sintoma(params).save(flush: true)

        then:"It exists"
            Sintoma.count() == 1

        when:"The domain instance is passed to the delete action"
            controller.delete(sintoma)

        then:"The instance is deleted"
            Sintoma.count() == 0
            response.redirectedUrl == '/sintoma/index'
            flash.message != null
    }
}
