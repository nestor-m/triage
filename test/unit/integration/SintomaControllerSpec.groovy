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
