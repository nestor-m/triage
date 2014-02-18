package triage

import grails.test.mixin.*
import spock.lang.Specification


/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(PacienteController)
@Mock([Persona,Paciente])
class PacienteControllerSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }
	
	void "Creo un paciente con su persona asociada y se persiste"(){
		when: "Creo una persona valida y la persisto"
	    	def persona = new Persona(
				nombre : "nestor",
				apellido : "muñoz",
				fechaDeNacimiento : "21/03/1987"
				).save( failOnError : true )

		and: "Creo un paciente con esa persona asociada y la persisto"
		  new Paciente(persona : persona,
			           fechaHoraIngreso: new Date()
					   ).save(failOnError : true )

		then: "La persona y el paciente se persistieron"
		  Persona.count() == 1
		  Paciente.count() == 1
	}

    void "Testeo que un paciente no se pueda persistir sin una persona asociada"() {
		when: "Intento guardar un paciente sin persona asociada"
		      new Paciente().save()			
		then: "No se guarda"
		      Paciente.count() == 0		      
    }
}
