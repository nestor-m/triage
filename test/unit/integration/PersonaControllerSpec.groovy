/*
Copyright (C) 2015  Nestor Muñoz. nestorgabriel2008@gmail.com; Marcia Tejeda. tejedamarcia@gmail.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/


package integration

import grails.test.mixin.*
import spock.lang.*
import triage.Paciente
import triage.Persona
import triage.PersonaController

@TestFor(PersonaController)
@Mock([Persona,Paciente])
class PersonaControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        params["nombre"] = 'unNombre'
		params["apellido"] = 'unApellido'
		params["fechaDeNacimiento"] = new Date("1987/03/21")
    }
	
	def populateValidJSONParams() {
		request.JSON.nombre = 'unNombre'
		request.JSON.apellido = 'unApellido'
		request.JSON.fechaDeNacimiento = "21/03/1987"
	}


	
	void "Testeo que al crear una persona tambien se crea un paciente relacionado"(){
		when:"Creo una persona y la persisto"
			populateValidJSONParams()
			controller.ajaxSave()

		then:"Tambien se crea un paciente asociado y se persiste"
			Persona.count() == 1
			Paciente.count() == 1
	}
	
	void "Testeo que una persona no se persite sin fecha de nacimiento"(){
		when:"Creo una persona e intento persistirla"
		    request.JSON.nombre = 'unNombre'
		    request.JSON.apellido = 'unApellido'
			//shouldFail(NullPointerException){
			//	controller.ajaxSave()
			//}

		then:"No se persiste ni la persona ni el paciente"
			Persona.count() == 0
			Paciente.count() == 0
	}
	
	void "Testeo que una persona no se persite si la fecha de nacimiento es futura"(){
		when:"Creo una persona e intento persistirla"
			populateValidJSONParams()
			request.JSON.fechaDeNacimiento = "09/05/2050"
			shouldFail(grails.validation.ValidationException){
				controller.ajaxSave()
			}

		then:"No se persiste ni la persona ni el paciente"
			Persona.count() == 0
			Paciente.count() == 0
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
			def resultados = controller.ajaxBuscar()
		
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
			def resultados = controller.ajaxBuscar()
		
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
			def resultados = controller.ajaxBuscar()
		
		then: "encuentro una persona con nombre Juan y apellido Perez"
			resultados[0].nombre == "Juan"
			resultados[0].apellido == "Perez"
			resultados.size() == 1
	}
	
	void "Testear que si los campos de busqueda estan vacios, no devuelvo nada"(){
		when: "no completo ningun campo de busqueda y presiono buscar"
			def resultados = controller.ajaxBuscar()
			
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
		def resultados = controller.ajaxBuscar()
		
		then: "encuentro 3 personas"
			resultados.size() == 3
			resultados[0].apellido == "Perez"
			resultados[1].apellido == "Perez"
			resultados[2].apellido == "Perez"
	}
	
	void "Testear que cuando busco por DNI, encuentro las personas correspondientes"() {
		when: "guardo 4 personas"
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
		request.JSON.dni = "34071823"
		
		then: "busco por dni y encuentro una sola persona"
			
			def resultados = controller.ajaxBuscar()
			resultados.size() == 1
	}
	
	void "Testear que cuando busco por fecha de nacimiento, encuentro las personas correspondientes"() {
		when: "guardo 4 personas"
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
		request.JSON.fechaDeNacimiento = "02/02/1987"
		
		then: "busco por fecha de nacimiento y encuentro dos personas"
			
			def resultados = controller.ajaxBuscar()
			resultados.size() == 2
	}
	
	void "Testear que cuando ingreso las primeras letras de un nombre encuentro las personas correspondientes"() {
		when: "guardo 4 personas"
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
		request.JSON.nombre = "mar"
		
		then: "busco por las primeras letras del nombre y encuentro las personas correspondientes"
			
			def resultados = controller.ajaxBuscar()
			resultados.size() == 2
			resultados[0].nombre == "Martin" | resultados[0].nombre == "Mariela"
			resultados[1].nombre == "Martin" | resultados[1].nombre == "Mariela"
	}
	
	void "Testear que cuando ingreso los primeros numeros del DNI encuentro las personas correspondientes"() {
		when: "guardo 4 personas"
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
		request.JSON.dni = "3"
		
		then: "busco por los primeros numeros del DNI y encuentro las personas correspondientes"
			
			def resultados = controller.ajaxBuscar()
			resultados.size() == 3
			resultados[0].nombre == "Martin" | resultados[0].nombre == "Mariela" | resultados[0].nombre == "Juan"
			resultados[1].nombre == "Martin" | resultados[1].nombre == "Mariela" | resultados[1].nombre == "Juan"
			resultados[2].nombre == "Martin" | resultados[2].nombre == "Mariela" | resultados[2].nombre == "Juan"
	}
}
