<%@ page import="triage.Persona" %>



<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'apellido', 'error')} required">
	<label for="apellido">
		<g:message code="persona.apellido.label" default="Apellido" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="apellido" required="" value="${personaInstance?.apellido}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'direccion', 'error')} ">
	<label for="direccion">
		<g:message code="persona.direccion.label" default="Direccion" />
		
	</label>
	<g:textField name="direccion" value="${personaInstance?.direccion}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'dni', 'error')} required">
	<label for="dni">
		<g:message code="persona.dni.label" default="Dni" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="dni" type="number" value="${personaInstance.dni}" required=""/>
</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'fechaDeNacimiento', 'error')} ">
	<label for="fechaDeNacimiento">
		<g:message code="persona.fechaDeNacimiento.label" default="Fecha De Nacimiento" />
		
	</label>
	<g:textField name="fechaDeNacimiento" value="${personaInstance?.fechaDeNacimiento}"/>
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

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'pacientes', 'error')} ">
	<label for="pacientes">
		<g:message code="persona.pacientes.label" default="Pacientes" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${personaInstance?.pacientes?}" var="p">
    <li><g:link controller="paciente" action="show" id="${p.id}">${p?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="paciente" action="create" params="['persona.id': personaInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'paciente.label', default: 'Paciente')])}</g:link>
</li>
</ul>

</div>

<div class="fieldcontain ${hasErrors(bean: personaInstance, field: 'telefono', 'error')} required">
	<label for="telefono">
		<g:message code="persona.telefono.label" default="Telefono" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="telefono" type="number" value="${personaInstance.telefono}" required=""/>
</div>

