import org.springframework.web.multipart.MaxUploadSizeExceededException;

import triage.Persona
import triage.Sintoma
import triage.TipoDeSintoma
import triage.Prioridad

class BootStrap {

    def init = { servletContext ->
		new Persona(nombre:"NESTOR",apellido:"MUÑOZ",fechaDeNacimiento:new Date("1987/03/21")).save()
		new Persona(nombre:"MARCIA",apellido:"TEJEDA",fechaDeNacimiento:new Date("1987/01/01")).save()
		
		def impresionInicial = new TipoDeSintoma(nombre:"IMPRESION INICIAL")
		impresionInicial.save()
		
		def muscular = new TipoDeSintoma(nombre: "DOLOR MUSCULAR")
		muscular.save()
		
		new Sintoma(nombre:"DOLOR SEVERO (p1)",prioridad: Prioridad.UNO,tipoDeSintoma: impresionInicial).save()
		new Sintoma(nombre:"DESHIDRATACION (p2)",prioridad: Prioridad.DOS,tipoDeSintoma: impresionInicial).save()
		new Sintoma(nombre:"CONTRACTURA (p3)", prioridad: Prioridad.TRES, tipoDeSintoma: muscular).save()
    }
	
    def destroy = {
    }
}
