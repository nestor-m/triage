package triage

import static org.springframework.http.HttpStatus.*

/**
* Valida que el usuario este logueado
*/
abstract class LoginController{

	/**
	* Antes de ejecutar cualquier metodo chequea que el usuario este logueado
	*/
	def beforeInterceptor = {
		if(!session.user) {
			response.status = 401
			return false
		}
	}

}