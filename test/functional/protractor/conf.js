exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['cargaSintomasTest.js']
  //specs: ['busquedaIngresoPacienteTest.js']
  //specs : ['signosVitalesTest.js']
  //specs: ['impresionVisualTest.js']
  //specs : ['pacienteIngresadoTest.js']
  //specs : ['reporteEsperasTest.js']//TODO: fallo
  //specs : ['reportePrioridadesTest.js']//TODO: fallo
  //specs : ['pacienteEsperaTest.js']
  //specs : ['ABMSintomasTest.js']
  //specs : ['ABMTiposDeSintomasTest.js']
  //specs : ['loginTest.js']  
  //specs : ['ABMUsuariosTest.js']
  //specs: ['./*']//corre todos los archivos de la carpeta
}
