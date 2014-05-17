package triage

import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin} for usage instructions
 */
@TestFor(Paciente)
@Mock([Persona,Paciente,TipoDeSintoma,Sintoma])
class PacienteSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }
	
	void "Test al crear paciente debe no estar finalizado"(){
		when: "Cargo una nueva persona y un paciente"
			def persona = new Persona(
			nombre : "nestor",
			apellido : "muñoz",
			fechaDeNacimiento : new Date()-1
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
			
		then: "Verifico que el paciente no esté finalizado"
			paciente.finalizado == false
	}
	
}
