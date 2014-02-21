package triage

import org.hibernate.validator.constraints.Length;

import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(BuscadorController)
@Mock([Persona,Paciente])
class BuscadorControllerSpec extends Specification {

    def setup() {

    }

    def cleanup() {
    }

    void "Testear que encuentro a todas las personas con un determinado nombre"() {
		when: "guardo dos personas y busco una persona que se llama Juan"
			def persona1 = new Persona(
				nombre : "Juan",
				apellido : "Perez",
				fechaDeNacimiento : new Date("1987/02/02"),
				dni : "34071823"
			)
			persona1.save()
			def persona2 = new Persona(
				nombre : "Martin",
				apellido : "Perez",
				fechaDeNacimiento : new Date("1987/02/02"),
				dni : "34071823"
			)
			persona2.save()
			request.JSON.nombre = "Juan"
			def resultados = controller.ajaxList()
		
		then: "encuentro una sola persona"
			resultados[0].nombre == "Juan"
			resultados.size() == 1
			
	}
	
	void "Testear que encuentro varias personas con el mismo nombre"() {
		when: "guardo dos personas llamadas Juan"
			def persona1 = new Persona(
				nombre : "Juan",
				apellido : "Perez",
				fechaDeNacimiento : new Date("1987/02/02"),
				dni : "34071823"
			)
			persona1.save()
			def persona2 = new Persona(
				nombre : "Juan",
				apellido : "Gomez",
				fechaDeNacimiento : new Date("1987/02/02"),
				dni : "35167277"
			)
			persona2.save()
			request.JSON.nombre = "Juan"
			def resultados = controller.ajaxList()
		
		then: "encuentro dos personas"
			resultados[0].nombre == "Juan"
			resultados[1].nombre == "Juan"
			resultados.size() == 2
	}
	
	
	void "Testear que encuentro solo una persona con determinado nombre y apellido"() {
		when: "guardo dos personas llamadas Juan pero con apellido distinto"
			def persona1 = new Persona(
				nombre : "Juan",
				apellido : "Perez",
				fechaDeNacimiento : new Date("1987/02/02"),
				dni : "34071823"
			)
			persona1.save()
			def persona2 = new Persona(
				nombre : "Juan",
				apellido : "Gomez",
				fechaDeNacimiento : new Date("1987/02/02"),
				dni : "35167277"
			)
			persona2.save()
			request.JSON.nombre = "Juan"
			request.JSON.apellido = "Perez"
			def resultados = controller.ajaxList()
		
		then: "encuentro una persona con nombre Juan y apellido Perez"
			resultados[0].nombre == "Juan"
			resultados[0].apellido == "Perez"
			resultados.size() == 1
	}
}
