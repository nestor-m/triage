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

import java.net.Authenticator.RequestorType;

import org.codehaus.groovy.grails.web.binding.bindingsource.JsonDataBindingSourceCreator.JsonArrayList;
import org.codehaus.groovy.grails.web.json.JSONObject;

import grails.converters.JSON
import grails.transaction.Transactional

import java.text.SimpleDateFormat

@Transactional //(readOnly = true) esto me hizo romper la cabeza durante unas cuantas horas :(
class PersonaController extends LoginController{

    static allowedMethods = [ ajaxList: "GET"
								,ajaxSave: "POST"
								,ajaxBuscar: "POST"
								,cargarPersona: "POST"]


	/**
	 * Submit del formulario de alta de persona
	 * @return
	 */
	@Transactional
	def ajaxSave() {
		//validacion para request desde herramientas como curl
		if(request.JSON.nombre == null || request.JSON.apellido == null || request.JSON.fechaDeNacimiento == null){
			return
		}

		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date fechaDeNacimiento = sdf.parse(request.JSON.fechaDeNacimiento);

		def persona = new Persona(
			nombre : request.JSON.nombre.toUpperCase(),
			apellido : request.JSON.apellido.toUpperCase(),
			fechaDeNacimiento : fechaDeNacimiento,
			dni : request.JSON.dni,
			direccion : request.JSON.direccion,
			telefono : request.JSON.telefono,
			obraSocial : request.JSON.obraSocial,
			nroAfiliado : request.JSON.nroAfiliado
		).save( failOnError : true, flush:true )
		
		Paciente paciente = new Paciente(persona: persona,fechaHoraIngreso: new Date()).save( failOnError : true )
		
		
		request.JSON.id = paciente.id
		request.JSON.nombre = persona.nombre
		request.JSON.apellido = persona.apellido
		request.JSON.fechaDeNacimiento = persona.fechaDeNacimiento.getDateString()
		request.JSON.DNI = persona.dni
		Boolean esAdulto = persona.esAdulto()
		request.JSON.esAdulto = esAdulto
		if(!esAdulto){//es pediatrico
			request.JSON.categoriaPediatrico = persona.getCategoriaPediatrico()
		}
		 
		render request.JSON //retorna el id del paciente + los datos de la persona
	}
	
	def ajaxList() {
		render Persona.findAll( "from Persona p" ) as JSON
	}
	
	/**submit del formulario del listado de busqueda de pacientes
	 *  
	 */
	def ajaxBuscar() {		
	//CON CRITERIA				
		List resultado = Persona.withCriteria {
			if (request.JSON.dni != '' && request.JSON.dni != null){
				ilike("dni",request.JSON.dni+"%") //ilike es un like case insensitive 
			}
			if (request.JSON.apellido != '' && request.JSON.apellido != null){
				ilike("apellido",request.JSON.apellido+"%")
			}
			if (request.JSON.nombre != '' && request.JSON.nombre != null){
				ilike("nombre",request.JSON.nombre+"%")
			}
			if (request.JSON.fechaDeNacimiento  != '' && request.JSON.fechaDeNacimiento  != null){
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
				Date fechaDeNacimiento = dateFormat.parse(request.JSON.fechaDeNacimiento);
				eq("fechaDeNacimiento",fechaDeNacimiento)
			}
		}		
		render resultado as JSON		
		return resultado	
	}	
	
	def cargarPersona(){
		Persona persona = Persona.get(request.JSON.id)
		request.JSON.nombre = persona.nombre
		request.JSON.apellido = persona.apellido
		request.JSON.fechaDeNacimiento = persona.fechaDeNacimiento.getDateString()
		request.JSON.dni = persona.dni
		request.JSON.direccion = persona.direccion
		request.JSON.telefono = persona.telefono
		request.JSON.obraSocial = persona.obraSocial
		request.JSON.nroAfiliado = persona.nroAfiliado
		
		String sql = "SELECT p.prioridad, p.id, p.fechaHoraAtencion, p.diastole, p.sistole, p.temperatura, "+
						"p.frecuenciaRespiratoria, p.glucosa, p.pulso, p.saturacionO2,"+
						" p.tipoAtencion FROM Paciente p where  finalizado = TRUE and persona_id = "+persona.id
						
		List consultaAtenciones = Paciente.executeQuery(sql)
		List atencionesResp = new ArrayList()
		for (atencion in consultaAtenciones) {
			String prioridad = traerPrioridad(atencion[0]);
			String fecha = new SimpleDateFormat("dd-MM-yyyy").format(atencion[2]);
			String sintomas = traerSintomas(atencion[1])
			String tipoAtencion = traerTipoAtencion(atencion[10])
			String presion = traerPresion(atencion[3], atencion[4])
			atencionesResp.add(new JSONObject('{"id":' + atencion[1] +
				',"prioridad":"' + prioridad + '"' +
				',"fechaAtencion":' + fecha +
				',"presion":' + presion +
				',"temperatura":' + atencion[5] +
				',"frecuencia":' + atencion[6] +
				',"glucosa":' + atencion[7] +
				',"pulso":' + atencion[8] +
				',"saturacion":' + atencion[9] +
				',"sintomas":' + sintomas +
				',"tipoAtencion":"' + tipoAtencion+ '"}'))
		}
		
		//println atencionesResp
		
		request.JSON.atenciones = atencionesResp
		render request.JSON as JSON
	}
	
	def traerTipoAtencion(Long nta){
		switch(nta){
			 case 1:
			 	return "Ingresa"
			 case 2:
			 	return "Consultorio externo"
			 case 3:
			 	return "Retira sin atención"
		}
			
	}
	
	def traerPresion(p1, p2){
		if (p1 == null || p2 == null) return null
		else return p1+"-"+p2
		
	}
	
	def traerSintomas (Long nid){
		Paciente p = Paciente.get(nid)
		List sintomas = new ArrayList()
		String ss = ""
		for (s in p.sintomas) {
			sintomas.add(s.nombre)
			ss = ss+" - "+(s.nombre)
		}
		if (ss == "") return null
		else return ss
	}
	
	String traerPrioridad (Prioridad p){
		if (p == Prioridad.UNO) return "Prioridad UNO"
		if (p == Prioridad.DOS) return "Prioridad DOS"
		if (p == Prioridad.TRES) return "Prioridad TRES"
		if (p == null) return "No se ha calculado"
	}
	
			
}
