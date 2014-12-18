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
