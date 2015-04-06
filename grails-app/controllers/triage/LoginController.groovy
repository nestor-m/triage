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