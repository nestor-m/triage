package triage

import grails.converters.JSON

class SintomaController {

	
	static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE",
		 ajaxListVisuales: "GET", ajaxList: "GET"]
	
	
	def ajaxListVisuales() {
		render Sintoma.findAll( "from Sintoma s" ) as JSON
	}
	
    def index() { }
}
