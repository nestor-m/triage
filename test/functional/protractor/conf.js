exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
//  specs: ['cargaSintomasTest.js']
//  specs: ['busquedaPersonasTest.js']
  //specs: ['busquedaIngresoPacienteTest.js']
  //specs : ['signosVitalesTest.js']
//  specs: ['impresionVisualTest.js']
  //specs : ['pacienteIngresadoTest.js']
//  specs : ['reporteEsperasTest.js']//TODO: fixed!
//  specs : ['reportePrioridadesTest.js']//TODO: fixed!
  //specs : ['pacienteEsperaTest.js']
//  specs : ['ABMSintomasTest.js']
  //specs : ['ABMTiposDeSintomasTest.js']
  //specs : ['loginTest.js']
//  specs:['ABMUsuariosTest.js']
  specs: ['./*']//corre todos los archivos de la carpeta
}
