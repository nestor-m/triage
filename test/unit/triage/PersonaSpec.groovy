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

    void "test getEdad"() {
    	when: "creo una persona que nacio hace un año"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-365)

    	then: "cuando le pido la edad me debe retornar 1"
    	persona.getEdad() == 1
    }

    void "test esAdulto"() {
    	when: "creo una persona que nacio hace un año"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-365)

    	then: "cuando le pregunto si es adulto debe retornar false"
    	!persona.esAdulto()
    }

    void "test getCategoriaPediatrico menorDe6Anios"() {
    	when: "creo una persona que nacio hace un año"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-365)

    	then: "cuando le pido la categoria de pediatrico me debe retornar menorDe6Anios"
    	persona.getCategoriaPediatrico() == 'menorDe6Anios'
    }

    void "test getCategoriaPediatrico menorDeUnAnio"() {
    	when: "creo una persona que nacio hace 3 meses"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-90)

    	then: "cuando le pido la categoria de pediatrico me debe retornar menorDeUnAnio"
    	persona.getCategoriaPediatrico() == 'menorDeUnAnio'
    }
	
	void "test getCategoriaPediatrico mayorDe6Anios"() {
    	when: "creo una persona que nacio hace 7 años"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-(7*365))

    	then: "cuando le pido la categoria de pediatrico me debe retornar mayorDe6Anios"
    	persona.getCategoriaPediatrico() == 'mayorDe6Anios'
    }

    void "test estaEntre3y36Meses true"() {
    	when: "creo una persona que nacio hace 5 meses"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-(30*5))

    	then: "cuando le pregunto si estaEntre3y36Meses debe retornar true"
    	persona.estaEntre3y36Meses()
    }

    void "test estaEntre3y36Meses false"() {
    	when: "creo una persona que nacio hace 7 años"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-(7*365))

    	then: "cuando le pregunto si estaEntre3y36Meses debe retornar false"
    	!persona.estaEntre3y36Meses()
    }

    void "test esMenorDeTresMeses true"() {
    	when: "creo una persona que nacio hace 7 dias"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-7)

    	then: "cuando le pregunto si esMenorDeTresMeses debe retornar true"
    	persona.esMenorDeTresMeses()
    }

    void "test esMenorDeTresMeses false"() {
    	when: "creo una persona que nacio hace 7 meses"    	
    	def persona = new Persona(nombre : "nestor",apellido : "muñoz",	fechaDeNacimiento : new Date()-(7*30))

    	then: "cuando le pregunto si esMenorDeTresMeses debe retornar false"
    	!persona.esMenorDeTresMeses()
    }

}
