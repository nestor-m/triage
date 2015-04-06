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

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //specs: ['cargaSintomasTest.js']
  //specs: ['busquedaPersonasTest.js']
  //specs: ['busquedaIngresoPacienteTest.js']
  //specs: ['signosVitalesTest.js']
  //specs: ['impresionVisualTest.js']
  //specs: ['pacienteIngresadoTest.js']
  //specs: ['reporteEsperasTest.js']
  //specs: ['reportePrioridadesTest.js']
  //specs: ['pacienteEsperaTest.js']
  //specs: ['ABMSintomasTest.js']
  //specs: ['ABMTiposDeSintomasTest.js']
  //specs: ['loginTest.js']
  //specs: ['ABMUsuariosTest.js']
  specs: ['demoUsuariosTest.js'],
  //specs: ['./*']//corre todos los archivos de la carpeta
  jasmineNodeOpts: {
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 60000*5//5 minutos//30000
  }
}
