package triage

import javax.persistence.criteria.CriteriaBuilder;

import org.hibernate.Criteria;

import com.sun.org.apache.bcel.internal.generic.RETURN;

import grails.converters.JSON

class BuscadorController {
	
	static allowedMethods = [ajaxList: "GET", ajaxSeleccionarPersona: "POST", ajaxCrearNuevaPersona: "POST"]

    def index() { }
	
	/*al seleccionar a la persona, crear paciente nuevo*/
	def ajaxList() {
		def query = Persona.where {
			nombre != null
		}
		
		if (request.JSON.dni != '' && request.JSON.dni != null){
			query = query.where {
				dni == request.JSON.dni  
			}
		}
		if (request.JSON.nombre != '' && request.JSON.nombre != null){
			query = query.where {
				nombre == request.JSON.nombre
			}
		}
		if (request.JSON.apellido != '' && request.JSON.apellido != null){
			query = query.where {
				apellido == request.JSON.apellido
			}
		}
		if (request.JSON.fechaDeNacimiento  != '' && request.JSON.fechaDeNacimiento  != null){
			query = query.where {
				fechaDeNacimiento == request.JSON.fechaDeNacimiento
			}
		}
		
		def resultados = query.list();
		
		render resultados as JSON
		
		return resultados
	}
	
	def ajaxSeleccionarPersona(){
		
	}
	
	def ajaxCrearNuevaPersona(){
		
	}
	
}
