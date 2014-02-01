package triage

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(PacienteController)
class PacienteControllerSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
		when: "hola" == "hola"
		then: "yo" == "yo"
    }
}
