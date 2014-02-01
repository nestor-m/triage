
<%@ page import="triage.Persona" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'persona.label', default: 'Persona')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-persona" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-persona" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list persona">
			
				<g:if test="${personaInstance?.dni}">
				<li class="fieldcontain">
					<span id="dni-label" class="property-label"><g:message code="persona.dni.label" default="Dni" /></span>
					
						<span class="property-value" aria-labelledby="dni-label"><g:fieldValue bean="${personaInstance}" field="dni"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.apellido}">
				<li class="fieldcontain">
					<span id="apellido-label" class="property-label"><g:message code="persona.apellido.label" default="Apellido" /></span>
					
						<span class="property-value" aria-labelledby="apellido-label"><g:fieldValue bean="${personaInstance}" field="apellido"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.direccion}">
				<li class="fieldcontain">
					<span id="direccion-label" class="property-label"><g:message code="persona.direccion.label" default="Direccion" /></span>
					
						<span class="property-value" aria-labelledby="direccion-label"><g:fieldValue bean="${personaInstance}" field="direccion"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.fechaDeNacimiento}">
				<li class="fieldcontain">
					<span id="fechaDeNacimiento-label" class="property-label"><g:message code="persona.fechaDeNacimiento.label" default="Fecha De Nacimiento" /></span>
					
						<span class="property-value" aria-labelledby="fechaDeNacimiento-label"><g:formatDate date="${personaInstance?.fechaDeNacimiento}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.nombre}">
				<li class="fieldcontain">
					<span id="nombre-label" class="property-label"><g:message code="persona.nombre.label" default="Nombre" /></span>
					
						<span class="property-value" aria-labelledby="nombre-label"><g:fieldValue bean="${personaInstance}" field="nombre"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.nroAfiliado}">
				<li class="fieldcontain">
					<span id="nroAfiliado-label" class="property-label"><g:message code="persona.nroAfiliado.label" default="Nro Afiliado" /></span>
					
						<span class="property-value" aria-labelledby="nroAfiliado-label"><g:fieldValue bean="${personaInstance}" field="nroAfiliado"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.obraSocial}">
				<li class="fieldcontain">
					<span id="obraSocial-label" class="property-label"><g:message code="persona.obraSocial.label" default="Obra Social" /></span>
					
						<span class="property-value" aria-labelledby="obraSocial-label"><g:fieldValue bean="${personaInstance}" field="obraSocial"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${personaInstance?.telefono}">
				<li class="fieldcontain">
					<span id="telefono-label" class="property-label"><g:message code="persona.telefono.label" default="Telefono" /></span>
					
						<span class="property-value" aria-labelledby="telefono-label"><g:fieldValue bean="${personaInstance}" field="telefono"/></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form url="[resource:personaInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${personaInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
