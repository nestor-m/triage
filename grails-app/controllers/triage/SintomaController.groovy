package triage



import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional

import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional //(readOnly = true)
class SintomaController {

	static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE",
		ajaxListVisuales: "GET", traerSintomas:"POST"]
	
	/**submit del formulario del listado de busqueda de pacientes
	 *
	 */
	def traerSintomas() {
		String sintoma = request.JSON.sintoma
		String tipoDeSintoma = request.JSON.tipoDeSintoma
		String prioridad = request.JSON.esAdulto?"prioridadAdulto":"prioridadPediatrico"

		
		List sintomas = Sintoma.executeQuery("select s.id,s.nombre,t.nombre,s."+prioridad+" from Sintoma s, TipoDeSintoma t where s.tipoDeSintoma = t.id " +
			                                  (sintoma != null ? "and s.nombre like '" + sintoma.toUpperCase() + "%'" : ' ') + 
											  (tipoDeSintoma != null ? "and t.nombre like '" + tipoDeSintoma.toUpperCase() + "%'" : ''))
		List resultado = new ArrayList()
		for(s in sintomas){
			resultado.add(new JSONObject('{"id":' + s[0] +
				                         ',"nombre":"' + s[1] + '"' +
										 ',"tipoDeSintoma":"' + s[2] + '"' +
										 ',"prioridad":"' + s[3] + '"}'))			
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
   
}
