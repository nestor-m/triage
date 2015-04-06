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

import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional
import grails.validation.ValidationException

import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional //(readOnly = true)
class SintomaController extends LoginController{

	static allowedMethods = [submitSintomaForm: "POST",
		ajaxListVisuales: "GET", traerSintomas:"POST",recuperarSintomas:"POST"]
	

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
		return resultado//TODO: unificar el formato del JSON con el que retorna el metodo ajaxListVisuales

		//render Sintoma.findAll( "from Sintoma p" ) as JSON
	}

	/*
	* Recupera los sintomas ingresados anteriormente
	*/
	def recuperarSintomas(){
		Paciente paciente = Paciente.get(request.JSON.id)				
		render paciente.sintomas as JSON
		return paciente.sintomas
	}
   
   def ajaxListVisuales() {
	   def query = Sintoma.where{
		   tipoDeSintoma.nombre == "IMPRESION INICIAL"
	   }
   
	   /*CON CRITERIA
	   def criteria = Sintoma.createCriteria()
	   def results = criteria.list {
		   tipoDeSintoma {
			   eq('nombre', 'IMPRESION INICIAL')
		   }
	   }*/

	   render query.list() as JSON //TODO: unificar el formato del JSON con el que retorna el metodo sintomasListado
   }

   /**
   * Agrega o actualiza un sintoma
   */
   @Transactional
   def submitSintomaForm(){
   		if(session.user.rol != Rol.ADMINISTRADOR){//valido que el usuario tenga rol ADMINISTRADOR
   			response.status = 401
   			render 'Usted no tiene permiso para crear o actualizar un sintoma' //respondo algo para que no me tire error 404
   			return
   		}

   		def id = request.JSON.id
   		def nombre = request.JSON.nombre.toUpperCase()
   		def tipoDeSintomaId = request.JSON.tipoDeSintomaId
   		def prioridadAdulto = request.JSON.prioridadAdulto
   		def prioridadPediatrico = request.JSON.prioridadPediatrico

   		//valido que no haya ningun campo faltante
   		if(nombre == null || nombre == '' || tipoDeSintomaId == null || tipoDeSintomaId == '' ||
   			prioridadAdulto == null || prioridadAdulto == '' || prioridadPediatrico == null || prioridadPediatrico == ''){
   			response.status = 500
   			render 'No se enviaron todos los campos necesarios'
   			return
   		}

   		if(id == null){//si el id esta en null es un sintoma nuevo
   			try {
   				new Sintoma(nombre: nombre, tipoDeSintoma: TipoDeSintoma.get(tipoDeSintomaId), 
   					prioridadAdulto: prioridadAdulto, prioridadPediatrico: prioridadPediatrico).save(failOnError : true)   
   			}catch(ValidationException ve) {
   				response.status = 500
  				render 'Error. Ya existe un síntoma ' + nombre + ' del discriminante ' + TipoDeSintoma.get(tipoDeSintomaId).nombre
  				return
			}

   			render 'Síntoma ' + nombre + ' cargado con éxito'
   		}else{//si me llega el id es porque es un update
   			def sintoma = Sintoma.get(id)
   			sintoma.nombre = nombre
   			sintoma.tipoDeSintoma = TipoDeSintoma.get(tipoDeSintomaId)
   			sintoma.prioridadAdulto = prioridadAdulto
   			sintoma.prioridadPediatrico = prioridadPediatrico
   			try{
   				sintoma.save(failOnError : true)
   				render 'Síntoma ' + nombre + ' actualizado con éxito'
   			}catch(ValidationException ve) {
   				response.status = 500
   				render 'Error. Ya existe un síntoma ' + nombre + ' del discriminante ' + TipoDeSintoma.get(tipoDeSintomaId).nombre
   			}
   			
   		}		  		
   }
   
}
