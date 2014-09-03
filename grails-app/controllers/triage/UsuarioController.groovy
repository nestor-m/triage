package triage

import static org.springframework.http.HttpStatus.*
import grails.converters.JSON

class UsuarioController {

    static allowedMethods = [login: "POST",logout:"GET"]

    def login(){    	
    	def user = Usuario.findWhere(nombre:request.JSON.usuario.toUpperCase(),password:request.JSON.password)
    	session.user = user
    	if(user){
    		render user as JSON
    	}else{
    		response.status = 401
    	}
    }

    def logout(){
    	session.user = null;
    	render 'CHAU'//tengo que responder algo porque sino tira error 404
    }

}