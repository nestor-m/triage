<%@ page import="triage.Sintoma" %>



<div class="fieldcontain ${hasErrors(bean: sintomaInstance, field: 'nombre', 'error')} ">
	<label for="nombre">
		<g:message code="sintoma.nombre.label" default="Nombre" />
		
	</label>
	<g:textField name="nombre" value="${sintomaInstance?.nombre}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: sintomaInstance, field: 'prioridad', 'error')} required">
	<label for="prioridad">
		<g:message code="sintoma.prioridad.label" default="Prioridad" />
		<span class="required-indicator">*</span>
	</label>
	<g:select name="prioridad" from="${triage.Prioridad?.values()}" keys="${triage.Prioridad.values()*.name()}" required="" value="${sintomaInstance?.prioridad?.name()}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: sintomaInstance, field: 'tipoDeSintoma', 'error')} required">
	<label for="tipoDeSintoma">
		<g:message code="sintoma.tipoDeSintoma.label" default="Tipo De Sintoma" />
		<span class="required-indicator">*</span>
	</label>
	<g:select name="tipoDeSintoma" from="${triage.TipoDeSintoma?.values()}" keys="${triage.TipoDeSintoma.values()*.name()}" required="" value="${sintomaInstance?.tipoDeSintoma?.name()}"/>
</div>

