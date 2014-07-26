package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional //(readOnly = true)
class TipoDeSintomaController {

	static allowedMethods = [traerTiposDeSintomas:"GET"]


	/**
	* Retorna todos los tipos de sintomas
	*/
	def traerTiposDeSintomas(){
		render TipoDeSintoma.findAll( "from TipoDeSintoma p" ) as JSON
	}

	

	/**
	* Genera los datos para el listado de sintomas
	*/
	def sintomasListado() {
		String sintoma = request.JSON.sintoma
		String tipoDeSintoma = request.JSON.tipoDeSintoma

		
		List sintomas = Sintoma.executeQuery("select s.id,s.nombre,t.nombre,s.prioridadAdulto,s.prioridadPediatrico from Sintoma s, TipoDeSintoma t where s.tipoDeSintoma = t.id " +
			                                  (sintoma != null ? "and s.nombre like '" + sintoma.toUpperCase() + "%'" : ' ') + 
											  (tipoDeSintoma != null ? "and t.nombre like '" + tipoDeSintoma.toUpperCase() + "%'" : ''))
		List resultado = new ArrayList()
		for(s in sintomas){
			resultado.add(new JSONObject('{"id":' + s[0] +
				                         ',"nombre":"' + s[1] + '"' +
										 ',"tipoDeSintoma":"' + s[2] + '"' +
										 ',"prioridadAdulto":"' + s[3] + '"'+			
										 ',"prioridadPediatrico":"' + s[4] + '"}'))			
		}
		
		render resultado as JSON
		return resultado
	}

	/*
	* Recupera los sintomas ingresados anteriormente
	*/
	def recuperarSintomas(){
		Paciente paciente = Paciente.get(request.JSON.id)		
		List resultado = new ArrayList()
		for(s in paciente.sintomas){
			Prioridad prioridad = paciente.esAdulto() ? s.prioridadAdulto : s.prioridadPediatrico			
			resultado.add(new JSONObject('{"id":' + s.id +
				                         ',"nombre":"' + s.nombre + '"' +
										 ',"tipoDeSintoma":"' + s.tipoDeSintoma + '"' +
										 ',"prioridad":"' + prioridad + '"}'))			
		}
		
		render resultado as JSON
		return resultado
	}
   
   def ajaxListVisuales() {
	   def query = Sintoma.where{
		   tipoDeSintoma.nombre == "IMPRESION INICIAL"
	   }
   
	   //CON CRITERIA
//	   def criteria = Sintoma.createCriteria()
//	   def results = criteria.list {
//		   tipoDeSintoma {
//			   eq('nombre', 'IMPRESION INICIAL')
//		   }
//	   }

	   render query.list() as JSON
   }

   /**
   * Elimina un sintoma de la base de datos.
   */
   @Transactional
   def borrarSintoma(){
   		def sintoma = Sintoma.get(request.JSON.id)
   		sintoma.delete()

   		//sintomasListado()
   		render 'Sintoma ' + sintoma.nombre + ' eliminado con exito =)'
   }
   
}
