package triage

import static org.springframework.http.HttpStatus.*

/**
* Valida que el usuario este logueado
*/
abstract class LoginController{

	/**
	* Antes de ejecutar cualquier metodo chequea que el usuario exista y este logueado
	*/
	def beforeInterceptor = {		
		if(!session.user || !usuarioExiste()) {
			response.status = 401
			return false
		}
	}

	Boolean usuarioExiste(){
		def usuario = Usuario.findWhere(nombre:session.user.nombre,rol:session.user.rol)//si me eliminaron o me modificaron me tiene que desloguear
		return usuario != null
	}

}