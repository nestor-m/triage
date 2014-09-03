import org.springframework.web.multipart.MaxUploadSizeExceededException;

import triage.Persona
import triage.Sintoma
import triage.TipoDeSintoma
import triage.Prioridad
import triage.Usuario
import triage.Rol

class BootStrap {

    def init = { servletContext ->
    	if(Usuario.count() == 0){
    		new Usuario(nombre:"ADMIN",password:"admin",rol:Rol.ADMINISTRADOR).save()
    		new Usuario(nombre:"USER",password:"user",rol:Rol.USUARIO).save()
    	}

    	if(Persona.count() == 0){//para que solo lo haga cuando la base esta vacia, sino tira error al iniciar
    		new Persona(nombre:"NESTOR",apellido:"MUÑOZ",fechaDeNacimiento:new Date("1987/03/21"),dni:33688677).save()
			new Persona(nombre:"MARCIA",apellido:"TEJEDA",fechaDeNacimiento:new Date("1987/01/01"),dni:12345678).save()
		
			def impresionInicial = new TipoDeSintoma(nombre:"IMPRESION INICIAL")
			impresionInicial.save()
		
			def muscular = new TipoDeSintoma(nombre: "DOLOR MUSCULAR")
			muscular.save()
		
			new Sintoma(nombre:"DOLOR SEVERO (p1-p3)",prioridadAdulto: Prioridad.UNO,prioridadPediatrico: Prioridad.TRES,tipoDeSintoma: impresionInicial).save()
			new Sintoma(nombre:"DESHIDRATACION (p2-p1)",prioridadAdulto: Prioridad.DOS,prioridadPediatrico: Prioridad.UNO,tipoDeSintoma: impresionInicial).save()
			new Sintoma(nombre:"CONTRACTURA (p3-p2)", prioridadAdulto: Prioridad.TRES,prioridadPediatrico: Prioridad.DOS, tipoDeSintoma: muscular).save()
    	}
		
    }
	
    def destroy = {
    }
}
