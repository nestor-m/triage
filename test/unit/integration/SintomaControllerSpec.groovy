package integration



import grails.test.mixin.*
import spock.lang.*
import triage.Prioridad
import triage.Sintoma
import triage.SintomaController
import triage.TipoDeSintoma

@TestFor(SintomaController)
@Mock(Sintoma)
class SintomaControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        params["nombre"] = 'palidez'
		params["prioridad"]  = Prioridad.UNO
		params["tipoDeSintoma"] = new TipoDeSintoma(nombre:"IMPRESION INICIAL") //TipoDeSintoma.IMPRESION_INICIAL
    }

   
}
