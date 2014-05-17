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

	TipoDeSintoma tipo = new TipoDeSintoma(nombre:'XXX')
	Sintoma sintomaP2 = new Sintoma(nombre:'prioridad2',prioridadAdulto:Prioridad.DOS,prioridadPediatrico:Prioridad.DOS,TipoDeSintoma:tipo)
	Sintoma sintomaP3 = new Sintoma(nombre:'prioridad3',prioridadAdulto:Prioridad.TRES,prioridadPediatrico:Prioridad.TRES,TipoDeSintoma:tipo)

    def setup() {

    }

    def cleanup() {
    }
	
	void "Test al crear paciente no debe estar finalizado"(){
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

	void "Test calcularPrioridad adulto sintoma prioridad 2"(){
		when: "Creo un adulto y le agrego un sintoma de prioridad 2 y otro de prioridad 3"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(27*365))//edad 27
		def paciente = new Paciente(persona : persona)
		paciente.addToSintomas(sintomaP2)
		paciente.addToSintomas(sintomaP3)
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.sintomas.size() == 2	
			paciente.calcularPrioridad() == Prioridad.DOS
	}

	void "Test calcularPrioridad adulto sintoma prioridad 3"(){
		when: "Creo un adulto y le agrego un sintoma de prioridad 3"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(27*365))//edad 27
		def paciente = new Paciente(persona : persona)
		paciente.addToSintomas(sintomaP3)
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.sintomas.size() == 1
			paciente.calcularPrioridad() == Prioridad.TRES
	}

	void "Test calcularPrioridad pediatrico sintoma prioridad 2"(){
		when: "Creo un pediatrico y le agrego un sintoma de prioridad 2 y otro de prioridad 3"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(10*365))//edad 10
		def paciente = new Paciente(persona : persona)
		paciente.addToSintomas(sintomaP2)
		paciente.addToSintomas(sintomaP3)
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.sintomas.size() == 2	
			paciente.calcularPrioridad() == Prioridad.DOS
	}

	void "Test calcularPrioridad pediatrico sintoma prioridad 3"(){
		when: "Creo un pediatrico y le agrego un sintoma de prioridad 3"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(10*365))//edad 10
		def paciente = new Paciente(persona : persona)
		paciente.addToSintomas(sintomaP3)
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.sintomas.size() == 1
			paciente.calcularPrioridad() == Prioridad.TRES
	}

	void "Test calcularPrioridad adulto temperatura prioridad 2"(){
		when: "Creo un adulto y le cargo temperatura de mas de 38.5"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(27*365))//edad 27
		def paciente = new Paciente(persona : persona)
		paciente.temperatura = '38.6-39.4'
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.calcularPrioridad() == Prioridad.DOS
	}

	void "Test calcularPrioridad glucosa prioridad 2"(){
		when: "Creo un adulto y le cargo glucosa de mas de 300"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(27*365))//edad 27
		def paciente = new Paciente(persona : persona)
		paciente.glucosa = 'más de 300'
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.calcularPrioridad() == Prioridad.DOS
	}

	void "Test calcularPrioridad adulto temperatura prioridad 3"(){
		when: "Creo un adulto y le cargo temperatura menor a 38.5"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(27*365))//edad 27
		def paciente = new Paciente(persona : persona)
		paciente.temperatura = '37.1-37.9'
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.TRES"
			paciente.calcularPrioridad() == Prioridad.TRES
	}

	void "Test calcularPrioridad menor de tres meses temperatura prioridad 2"(){
		when: "Creo un pediatrico menor de tres meses y le cargo una temperatura de mas de 38.0"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-30)//edad 30 dias
		def paciente = new Paciente(persona : persona)
		paciente.temperatura = '38.0-38.5'
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.calcularPrioridad() == Prioridad.DOS
	}

	void "Test calcularPrioridad menor de tres meses temperatura prioridad 3"(){
		when: "Creo un pediatrico menor de tres meses y le cargo una temperatura de mas de 38.0"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-30)//edad 30 dias
		def paciente = new Paciente(persona : persona)
		paciente.temperatura = '37.1-37.9'
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.TRES"
			paciente.calcularPrioridad() == Prioridad.TRES
	}

	void "Test calcularPrioridad entre 3 y 36 meses temperatura prioridad 2"(){
		when: "Creo un pediatrico entre 3 y 36 meses y le cargo una temperatura de mas de 39.4"
		def persona = new Persona(nombre : "nestor",apellido : "muñoz",fechaDeNacimiento : new Date()-(30*20))//edad 20 meses
		def paciente = new Paciente(persona : persona)
		paciente.temperatura = '39.5-41.0'
			
		then: "Cuando calcula la prioridad debe retornar Prioridad.DOS"
			paciente.calcularPrioridad() == Prioridad.DOS
	}
	
}
