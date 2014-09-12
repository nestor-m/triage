package triage

import static org.springframework.http.HttpStatus.*
import grails.converters.JSON
import grails.transaction.Transactional
import grails.validation.ValidationException

class UsuarioController {

    static allowedMethods = [login: "POST",logout:"GET"]

    def beforeInterceptor = [action: this.&auth, except: ['login','logout','cambiarPass']]

    // defined with private scope, so it's not considered an action
    private auth() {
        if (!session.user || session.user.rol != Rol.ADMINISTRADOR) {
            response.status = 401
            render 'Usted no tiene permisos de administrador' //respondo algo para que no me tire error 404
            return false
        }
    }

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

    /**
    * Elimina un usuario de la base de datos.
    **/
    @Transactional
    def eliminarUsuario(){
        def usuario = Usuario.get(request.JSON.id)
        usuario.delete()
        render 'Usuario ' + usuario.nombre + ' eliminado con exito =)'//es necesario que responda algo para que se ejecute el success del lado del cliente
    }

    /**
    * Retorna los usuarios
    */
    def traerUsuarios(){
        if(request.JSON.nombre != null && request.JSON.nombre !=''){
            render Usuario.findAll("from Usuario as u where u.nombre like ?", [request.JSON.nombre.toUpperCase()+'%']) as JSON
        }else{
            render Usuario.findAll() as JSON
        }       
    }

   /**
   * Agrega o actualiza un usuario
   */
   @Transactional
   def submit(){
        def id = request.JSON.usuario.id
        def nombre = request.JSON.usuario.nombre.toUpperCase()
        def rol = request.JSON.usuario.rol

        //valido que no haya ningun campo faltante
        if(nombre == null || nombre == '' || rol == null || rol == ''){
            response.status = 500
            render 'No se enviaron todos los campos necesarios'
            return
        }

        if(id == null){//si el id esta en null es un sintoma nuevo
            try {
                new Usuario(nombre: nombre, rol: rol,password: 'triage').save(failOnError : true)//triage es la pass para todos los nuevos usuarios
            }catch(ValidationException ve) {
                render 'Error. Ya existe un usuario con el nombre ' + nombre
                return
            }

            render 'Usuario ' + nombre + ' creado con éxito'
        }else{//si me llega el id es porque es un update
            def usuario = Usuario.get(id)
            usuario.nombre = nombre
            usuario.rol = rol
            usuario.save(failOnError : true)
            render 'Usuario ' + nombre + ' actualizado con éxito'
        }               
   }

   /**
   * Cambia la password del usuario
   */
   @Transactional
   def cambiarPass(){
        def usuario = Usuario.get(request.JSON.usuario.id)
        if(usuario.password == request.JSON.pass.anterior){
            if(request.JSON.pass.nueva.size() >= 6){//valido que la nueva pass tenga al menos 6 caracteres, esta validacion tmbien se hace en angular
                usuario.password = request.JSON.pass.nueva
                usuario.save(failOnError : true)
                render 'Contraseña actualizada con éxito'
            }else{
                response.status = 500
                render 'Error. La contraseña nueva es demasiado corta. Ingrese al menos 6 caracteres'
            }
        }else{
            response.status = 500
            render 'Error. La contraseña anterior es incorrecta'
        }
   }

}