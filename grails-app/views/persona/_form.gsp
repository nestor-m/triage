<%@ page import="triage.Persona" %>



<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'dni', 'error')} required">
	<label for="dni">
		<g:message code="persona.dni.label" default="Dni" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="dni" type="number" value="${personaInstance.dni}" required=""/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'apellido', 'error')} ">
	<label for="apellido">
		<g:message code="persona.apellido.label" default="Apellido" />
		
	</label>
	<g:textField name="apellido" value="${personaInstance?.apellido}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'direccion', 'error')} ">
	<label for="direccion">
		<g:message code="persona.direccion.label" default="Direccion" />
		
	</label>
	<g:textField name="direccion" value="${personaInstance?.direccion}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'fechaDeNacimiento', 'error')} required">
	<label for="fechaDeNacimiento">
		<g:message code="persona.fechaDeNacimiento.label" default="Fecha De Nacimiento" />
		<span class="required-indicator">*</span>
	</label>
	<g:datePicker name="fechaDeNacimiento" precision="day"  value="${personaInstance?.fechaDeNacimiento}"  />
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'nombre', 'error')} ">
	<label for="nombre">
		<g:message code="persona.nombre.label" default="Nombre" />
		
	</label>
	<g:textField name="nombre" value="${personaInstance?.nombre}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'nroAfiliado', 'error')} required">
	<label for="nroAfiliado">
		<g:message code="persona.nroAfiliado.label" default="Nro Afiliado" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="nroAfiliado" type="number" value="${personaInstance.nroAfiliado}" required=""/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'obraSocial', 'error')} ">
	<label for="obraSocial">
		<g:message code="persona.obraSocial.label" default="Obra Social" />
		
	</label>
	<g:textField name="obraSocial" value="${personaInstance?.obraSocial}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'telefono', 'error')} required">
	<label for="telefono">
		<g:message code="persona.telefono.label" default="Telefono" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="telefono" type="number" value="${personaInstance.telefono}" required=""/>
</div>

