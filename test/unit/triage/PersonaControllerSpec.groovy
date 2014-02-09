package triage



import grails.test.mixin.*
import spock.lang.*

@TestFor(PersonaController)
@Mock(Persona)
class PersonaControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
    }

    void "Test the index action returns the correct model"() {

        when:"The index action is executed"
            controller.index()

        then:"The model is correct"
            !model.personaInstanceList
            model.personaInstanceCount == 0
    }

    void "Test the create action returns the correct model"() {
        when:"The create action is executed"
            controller.create()

        then:"The model is correctly created"
            model.personaInstance!= null
    }

    void "Test the save action correctly persists an instance"() {

        when:"The save action is executed with an invalid instance"
            def persona = new Persona()
            persona.validate()
            controller.save(persona)

        then:"The create view is rendered again with the correct model"
            model.personaInstance!= null
            view == 'create'

        /*when:"The save action is executed with a valid instance"
            response.reset()
            populateValidParams(params)
            persona = new Persona(params)

            controller.save(persona)

        then:"A redirect is issued to the show action"
            response.redirectedUrl == '/persona/show/1'
            controller.flash.message != null
            Persona.count() == 1*/
    }

    void "Test that the show action returns the correct model"() {
        when:"The show action is executed with a null domain"
            controller.show(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the show action"
            populateValidParams(params)
            def persona = new Persona(params)
            controller.show(persona)

        then:"A model is populated containing the domain instance"
            model.personaInstance == persona
    }

    void "Test that the edit action returns the correct model"() {
        when:"The edit action is executed with a null domain"
            controller.edit(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the edit action"
            populateValidParams(params)
            def persona = new Persona(params)
            controller.edit(persona)

        then:"A model is populated containing the domain instance"
            model.personaInstance == persona
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when:"Update is called for a domain instance that doesn't exist"
            controller.update(null)

        then:"A 404 error is returned"
            response.redirectedUrl == '/persona/index'
            flash.message != null


        when:"An invalid domain instance is passed to the update action"
            response.reset()
            def persona = new Persona()
            persona.validate()
            controller.update(persona)

        then:"The edit view is rendered again with the invalid instance"
            view == 'edit'
            model.personaInstance == persona

        /*when:"A valid domain instance is passed to the update action"
            response.reset()
            populateValidParams(params)
            persona = new Persona(params).save(flush: true)
            controller.update(persona)

        then:"A redirect is issues to the show action"
            response.redirectedUrl == "/persona/show/$persona.id"
            flash.message != null*/
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when:"The delete action is called for a null instance"
            controller.delete(null)

        then:"A 404 is returned"
            response.redirectedUrl == '/persona/index'
            flash.message != null

        /*when:"A domain instance is created"
            response.reset()
            populateValidParams(params)
            def persona = new Persona(params).save(flush: true)

        then:"It exists"
            Persona.count() == 1*/

        /*when:"The domain instance is passed to the delete action"
            controller.delete(persona)

        then:"The instance is deleted"
            Persona.count() == 0
            response.redirectedUrl == '/persona/index'
            flash.message != null*/
    }
}
