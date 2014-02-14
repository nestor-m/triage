package triage

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin} for usage instructions
 */
@TestFor(Persona)
class PersonaSpec extends Specification {

    def setup() {
		
    }

    def cleanup() {
    }

    void "test something"() {
    }
	
	
	void "Test que el nombre y el apellido no esten vacios"() {
		when: 'el nombre esta en blanco'
		def p = new Persona()

		then: 'validation should fail'
		!p.validate()

		when: 'the name begins with an upper case letter'
		p = new Persona(nombre: 'Juan', apellido: 'perez')

		then: 'validation should pass'
		p.validate()
	}
}
