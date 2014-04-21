exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //specs: ['cargaSintomasTest.js']
  //specs: ['busquedaIngresoPacienteTest.js','cargaSintomasTest.js']
  specs : ['signosVitales.js']
//  specs: ['./*']//corre todos los archivos de la carpeta
}
