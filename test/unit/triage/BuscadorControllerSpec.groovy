package triage


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
	
	
	void "Testear que si los campos de busqueda estan vacios, no devuelvo nada"(){
		when: "no completo ningun campo de busqueda y presiono buscar"
			def resultados = controller.ajaxList()
			
		then: "no recibo resultados"
			resultados.size() == 0
	}
	
	
	void "Testeo que al buscar un apellido recibo todas las personas con el mismo" (){
		when: "guardo 4 personas, y 3 tienen el mismo apellido"
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
			dni : "35167277"
		)
		persona2.save()
		def persona3 = new Persona(
			nombre : "Mariela",
			apellido : "Perez",
			fechaDeNacimiento : new Date("1990/02/02"),
			dni : "38961823"
		)
		persona3.save()
		def persona4 = new Persona(
			nombre : "Luis",
			apellido : "Gomez",
			fechaDeNacimiento : new Date("1980/08/02"),
			dni : "652987"
		)
		persona4.save()
		
		request.JSON.apellido = "Perez"
		def resultados = controller.ajaxList()
		
		then: "encuentro 3 personas"
			resultados.size() == 3
			resultados[0].apellido == "Perez"
			resultados[1].apellido == "Perez"
			resultados[2].apellido == "Perez"
	}
	
	
	
	
}
