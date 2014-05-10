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

 
	
	void "Testeo que si la temperatura es menor a 35°, el paciente es prioridad 1"(){
		when: "Creo un nuevo paciente"
		def persona = new Persona(
			nombre : "nestor",
			apellido : "muñoz",
			fechaDeNacimiento : new Date()-1
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
		
		and: "cargo la temperatura en 34"
		 paciente.temperatura = 34
		 
		then: "la persona es prioridad 1"
		paciente.esPrioridadUno()
	}
	
	
	void "Testeo que si la temperatura es mayor a 40, el paciente es prioridad 1"(){
		when: "Creo un nuevo paciente"
		def persona = new Persona(
			nombre : "juan",
			apellido : "perez",
			fechaDeNacimiento : new Date()-15
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
		
		and: "cargo la temperatura en 41"
		 paciente.temperatura = 41
		 
		then: "la persona es prioridad 1"
		paciente.esPrioridadUno()
	}
	
	
	
	void "Testeo que si el pulso es menor a 40, el paciente es prioridad 1"(){
		when: "Creo un nuevo paciente"
		def persona = new Persona(
			nombre : "juan",
			apellido : "perez",
			fechaDeNacimiento : new Date()-30
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
		
		and: "cargo el pulso en en 24"
		 paciente.pulso = 24
		 
		then: "la persona es prioridad 1"
		paciente.esPrioridadUno()
	}
	
	
	void "Testeo que si el pulso es mayor a 150, el paciente es prioridad 1"(){
		when: "Creo un nuevo paciente"
		def persona = new Persona(
			nombre : "maria",
			apellido : "lopez",
			fechaDeNacimiento : new Date()-10
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
		
		and: "cargo el pulso en 165"
		 paciente.pulso = 165
		 
		then: "la persona es prioridad 1"
		paciente.esPrioridadUno()
	}
	
	
	void "Testeo que si la frecuencia  es menor a 12, el paciente es prioridad 1"(){
		when: "Creo un nuevo paciente"
		def persona = new Persona(
			nombre : "juan carlos",
			apellido : "lopez",
			fechaDeNacimiento : new Date()-10
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
		
		and: "cargo la frecuencia en 10"
		 paciente.frecuenciaRespiratoria = 10
		 
		then: "la persona es prioridad 1"
		paciente.esPrioridadUno()
	}
	
	void "Testeo que si la frecuencia  es mayor a 30, el paciente es prioridad 1"(){
		when: "Creo un nuevo paciente"
		def persona = new Persona(
			nombre : "pepe",
			apellido : "solis",
			fechaDeNacimiento : new Date()-10
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona).save(failOnError : true )
		
		and: "cargo la frecuencia en 40"
		 paciente.frecuenciaRespiratoria = 40
		 
		then: "la persona es prioridad 1"
		paciente.esPrioridadUno()
	}
	
	void "Test al crear paciente debe no estar finalizado"(){
		when: "Cargo una nueva persona y un paciente"
			def persona = new Persona(
			nombre : "nestor",
			apellido : "muñoz",
			fechaDeNacimiento : new Date()-1
			).save( failOnError : true )
		def paciente = new Paciente(persona : persona, finalizado : false).save(failOnError : true )
			
		then: "Verifico que el paciente no esté finalizado"
			paciente.finalizado == false
	}
	
	
	
	
	
}
