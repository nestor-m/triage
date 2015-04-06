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

import org.springframework.web.multipart.MaxUploadSizeExceededException;

import triage.Persona
import triage.Sintoma
import triage.TipoDeSintoma
import triage.Prioridad
import triage.Usuario
import triage.Rol

class BootStrap {

	//AGREGAR UN USUARIO ADMINISTRADOR Y EL TIPO DE SINTOMA IMPRESION INICIAL
    def init = { servletContext ->
    	if(Usuario.count() == 0){
    		new Usuario(nombre:"LUIS",password:"triage",rol:Rol.ADMINISTRADOR).save()//creo el usuario administrador luis
    		new TipoDeSintoma(nombre:"IMPRESION INICIAL").save()//creo el tipo de sintoma IMPRESION INICIAL
    	}

    	/*if(Persona.count() == 0){//para que solo lo haga cuando la base esta vacia, sino tira error al iniciar
    		new Persona(nombre:"NESTOR",apellido:"MUÑOZ",fechaDeNacimiento:new Date("1987/03/21"),dni:33688677).save()
			new Persona(nombre:"MARCIA",apellido:"TEJEDA",fechaDeNacimiento:new Date("1987/01/01"),dni:12345678).save()
			
			new Persona(nombre:"JUAN",apellido:"LOPEZ",fechaDeNacimiento:new Date("1999/03/21"),dni:33688568).save()
			new Persona(nombre:"LUISA",apellido:"MARTINEZ",fechaDeNacimiento:new Date("2012/01/01"),dni:12458956).save()
		
			def impresionInicial = new TipoDeSintoma(nombre:"IMPRESION INICIAL")
			impresionInicial.save()
		
			def muscular = new TipoDeSintoma(nombre: "DOLOR MUSCULAR")
			muscular.save()
		
			new Sintoma(nombre:"DOLOR SEVERO (p1-p3)",prioridadAdulto: Prioridad.UNO,prioridadPediatrico: Prioridad.TRES,tipoDeSintoma: impresionInicial).save()
			new Sintoma(nombre:"DESHIDRATACION (p2-p1)",prioridadAdulto: Prioridad.DOS,prioridadPediatrico: Prioridad.UNO,tipoDeSintoma: impresionInicial).save()
			new Sintoma(nombre:"CONTRACTURA (p3-p2)", prioridadAdulto: Prioridad.TRES,prioridadPediatrico: Prioridad.DOS, tipoDeSintoma: muscular).save()
    	}*/
		
    }
	
    def destroy = {
    }
}
