/* 
Copyright (C) 2015  Nestor Muñoz. nestorgabriel2008@gmail.com; Marcia Tejeda. tejedamarcia@gmail.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

package triage

class Sintoma implements Serializable{
	
	String nombre
	Prioridad prioridadAdulto
	Prioridad prioridadPediatrico
	
	static belongsTo = [tipoDeSintoma : TipoDeSintoma]	

    static constraints = {
		nombre unique: 'tipoDeSintoma'//nombre + tipo de sintoma son unicos
    }
	
//	static mapping = {
//		id composite: ['nombre','tipoDeSintoma'] //PK // Esto no andaba bien, lo reemplaze por: nombre unique: 'tipoDeSintoma'
//	}
}
