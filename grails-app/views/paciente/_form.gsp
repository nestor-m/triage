Integer tipoFin = request.JSON.tipoFin
		Paciente paciente = Paciente.get(request.JSON.id)
		paciente.tipoAtencion = tipoFin
		paciente.finalizado = true
		paciente.save(flush:true)<%@ page import="triage.Paciente" %>



<div class="fieldcontain ${hasErrors(bean: pacienteInstance, field: 'persona', 'error')} required">
	<label for="persona">
		<g:message code="paciente.persona.label" default="Persona" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="persona" name="persona.id" from="${triage.Persona.list()}" optionKey="id" required="" value="${pacienteInstance?.persona?.id}" class="many-to-one"/>
</div>

