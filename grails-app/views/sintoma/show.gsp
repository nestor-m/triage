
<%@ page import="triage.Sintoma" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'sintoma.label', default: 'Sintoma')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-sintoma" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-sintoma" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list sintoma">
			
				<g:if test="${sintomaInstance?.nombre}">
				<li class="fieldcontain">
					<span id="nombre-label" class="property-label"><g:message code="sintoma.nombre.label" default="Nombre" /></span>
					
						<span class="property-value" aria-labelledby="nombre-label"><g:fieldValue bean="${sintomaInstance}" field="nombre"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${sintomaInstance?.prioridad}">
				<li class="fieldcontain">
					<span id="prioridad-label" class="property-label"><g:message code="sintoma.prioridad.label" default="Prioridad" /></span>
					
						<span class="property-value" aria-labelledby="prioridad-label"><g:fieldValue bean="${sintomaInstance}" field="prioridad"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${sintomaInstance?.tipoDeSintoma}">
				<li class="fieldcontain">
					<span id="tipoDeSintoma-label" class="property-label"><g:message code="sintoma.tipoDeSintoma.label" default="Tipo De Sintoma" /></span>
					
						<span class="property-value" aria-labelledby="tipoDeSintoma-label"><g:fieldValue bean="${sintomaInstance}" field="tipoDeSintoma"/></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form url="[resource:sintomaInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${sintomaInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
