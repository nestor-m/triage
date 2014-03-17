package triage

import grails.converters.JSON
import grails.test.mixin.*
import org.codehaus.groovy.grails.web.json.JSONObject
import spock.lang.Specification


/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(PacienteController)
@Mock([Persona,Paciente,TipoDeSintoma,Sintoma])
class PacienteControllerSpec extends Specification {
	
	def cargarParametrosDePersona(params) {
		assert params != null
		params["nombre"] = 'unNombre'
		params["apellido"] = 'unApellido'
		params["fechaDeNacimiento"] = new Date("1987/03/21")
	}

    def setup() {
    }

    def cleanup() {
    }
	
	void "Creo un paciente con su persona asociada y se persiste"(){
		when: "Creo una persona valida y la persisto"
	    	def persona = new Persona(
				nombre : "nestor",
				apellido : "muñoz",
				fechaDeNacimiento : new Date()-1//nacio ayer
				).save( failOnError : true )

		and: "Creo un paciente con esa persona asociada y la persisto"
		  new Paciente(persona : persona).save(failOnError : true )

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
	
	void "Test cargar paciente desde el listado de busqueda"(){
		when: "Cargo una nueva persona"
			cargarParametrosDePersona(params)
			Persona persona =  new Persona(params)
			persona.save()
			
		and: "Cargo un paciente asociado desde el listado de busqueda"
			request.JSON.id = 1
			controller.cargarPaciente()
			
		then: "Se persistio un nuevo paciente"
			Paciente.count() == 1
	}
	
	void "Test si no me llega el id desde el listado de busqueda no puedo cargar paciente"(){
		when: "Cargo una nueva persona"
			cargarParametrosDePersona(params)
			Persona persona =  new Persona(params)
			persona.save()
			
		and: "Cargo un paciente asociado desde el listado de busqueda"
			shouldFail(grails.validation.ValidationException){
				controller.cargarPaciente()
			}
			
		then: "Se persistio un nuevo paciente"
			Paciente.count() == 0
	}
	
	void "Test respuesta json al cargar paciente desde el listado de busqueda"(){
		when: "Cargo una nueva persona"
			cargarParametrosDePersona(params)
			Persona persona =  new Persona(params)
			persona.save()
			
		and: "Cargo un paciente asociado desde el listado de busqueda"
			request.JSON.id = 1
			controller.cargarPaciente()
			
		then: "La respuesta json es la esperada"
			response.json.id == 1
			response.json.nombre == "unNombre"
	}
	
	List cargarSintomas(){
		def impresionInicial = new TipoDeSintoma(nombre:"IMPRESION INICIAL")
		impresionInicial.save()
		
		def muscular = new TipoDeSintoma(nombre: "DOLOR MUSCULAR")
		muscular.save()
		
		Sintoma dolorSevero = new Sintoma(nombre:"DOLOR SEVERO",prioridad: Prioridad.UNO,tipoDeSintoma: impresionInicial)
		dolorSevero.save()
		Sintoma deshidratacion = new Sintoma(nombre:"DESHIDRATACION",prioridad: Prioridad.DOS,tipoDeSintoma: impresionInicial)
		deshidratacion.save()
		Sintoma contractura = new Sintoma(nombre:"CONTRACTURA", prioridad: Prioridad.TRES, tipoDeSintoma: muscular)
		contractura.save()
		
		return [dolorSevero,deshidratacion,contractura]
	}
	
	Paciente cargarPaciente(){
		cargarParametrosDePersona(params)
		Persona persona =  new Persona(params)
		persona.save()
		Paciente paciente = new Paciente(persona: persona)
		paciente.save()
		return paciente
	}
	
	void "Test find dinamico"(){
		when:"Cargo sintomas"
			this.cargarSintomas();
			
		and:"Los busco con find dinamico"
			Sintoma dolorSevero = Sintoma.findByNombre("DOLOR SEVERO")
			TipoDeSintoma impresionInicial = TipoDeSintoma.findByNombre("IMPRESION INICIAL")
			Sintoma deshidratacion = Sintoma.findByNombreAndTipoDeSintoma("DESHIDRATACION", impresionInicial)
			
		then:"Verifico que los valores obtenidos son los correctos"
			dolorSevero.nombre == "DOLOR SEVERO"
			impresionInicial.nombre == "IMPRESION INICIAL"
			dolorSevero.tipoDeSintoma == impresionInicial
			deshidratacion.nombre == "DESHIDRATACION"
			deshidratacion.tipoDeSintoma == impresionInicial
	}
	
	void "Test addTo"(){
		when:"Creo un paciente y le cargo tres sintomas"
			Paciente paciente = this.cargarPaciente()
			this.cargarSintomas();
			paciente.addToSintomas(Sintoma.get(1))
			paciente.addToSintomas(Sintoma.get(2))
			paciente.addToSintomas(Sintoma.get(3))
			paciente.addToSintomas(Sintoma.get(1))//no carga repetidos
			
		then:"Verifico que los sintomas se hayan cargado"
			paciente.sintomas.size() == 3
	}
	
	void "Test cargar impresion inicial"(){
		when: "Cargo una nueva persona y un paciente asociado"
			Paciente paciente = this.cargarPaciente()
			
		and: "Creo un JSON con los sintomas y se los cargo al paciente"
			List sintomas = this.cargarSintomas();

			request.JSON.id = 1
			request.JSON.sintomas = [sintomas[0],sintomas[1]]
			
			controller.cargarImpresionInicial()
		
		then: "Verifico que los sintomas se hayan cargado correctamente"
			paciente.sintomas.size() == 2
	}
	
	void "Test cargar impresion inicial con sintoma de priorida uno"(){
		when: "Cargo una nueva persona y un paciente asociado"
			Paciente paciente = this.cargarPaciente()
			
		and: "Creo un JSON con los sintomas y se los cargo al paciente"
			List sintomas = this.cargarSintomas();

			request.JSON.id = 1
			request.JSON.sintomas = sintomas
			
			controller.cargarImpresionInicial()
		
		then: "Verifico que los sintomas se hayan cargado correctamente"
			paciente.prioridad == Prioridad.UNO
			response.json.prioridad.name == "UNO"
	}
	
	/*tengo que ver cómo cargar un sintoma en el JSON*/
	void "Test cargar sintomas"(){
		when: "Cargo una nueva persona y un paciente asociado"
			Paciente paciente = this.cargarPaciente()
			
		and: "Creo un JSON con el sintoma y se lo cargo al paciente"
			this.cargarSintomas();
//			request.JSON = new JSONObject('{"id":1,"sintomas":[' +
//													 '{"nombre":"CONTRACTURA",'+
//													  'prioridad: {"enumType":"triage.Prioridad","name":"TRES"},'+
//													 'tipoDeSintoma : {nombre: "DOLOR MUSCULAR"}}'+
//													 ']}')
			request.JSON.id = 1
			request.JSON.sintomas = [Sintoma.get(1)]
			
			controller.cargarSintomas()
		
		then: "Verifico que el sintoma se haya cargado correctamente"
			paciente.sintomas.size() == 1
	}
	
	public static void main(String[] args){
		println new Date()-1;//ayer
	} 
}
