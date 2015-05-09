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

class Persona { //implements Serializable{

    String dni 
	String nombre
	String apellido
	Date fechaDeNacimiento
	String direccion 
	String telefono 
	String obraSocial 
	String nroAfiliado	

    static hasMany = [pacientes : Paciente]    

    static constraints = {
		apellido blank: false
		nombre blank:false
		dni nullable: true 
		direccion nullable: true
		telefono nullable: true
		obraSocial nullable: true
		nroAfiliado nullable: true 
		fechaDeNacimiento(validator: { val, obj ->
			val < new Date()//validacion para que la fecha de nacimiento no sea futura
		})
    }
	
	//PK = nombre + apellido + fechaDeNacimiento
//	static mapping = {
//		id composite: ['nombre','apellido','fechaDeNacimiento']
//	}

	Boolean esAdulto(){
		return getEdad() > 14 //a partir de los 15 anios una persona es considerada adulta para el triage
	}

	int getEdad(){
		int edad = (new Date() - fechaDeNacimiento) / 365 //la resta de date retorna la cantidad de dias, dividido 365 retorna la cantidad de anios
		return edad
	}

	String getDescripcionEdad(){
		int dias = new Date() - this.fechaDeNacimiento//retorna la diferencia en dias
		if(dias < 30){
			return dias + " dias"
		}else{
			if(dias < 365){
				return ((int) dias / 30) + " meses"
			}else{
				return (int) dias / 365
			}			
		}
	}

	/**
	* Este metodo se utiliza para la logica de los signos vitales y las prioridades en pediatricos
	*/
	String getCategoriaPediatrico(){
		int edad = this.getEdad()
		if(edad > 5){
			return 'mayorDe6Anios'
		}else{
			if(edad > 0 && edad < 6){
				return 'menorDe6Anios'
			}else{
				return 'menorDeUnAnio'
			}
		}
	}

	Boolean esMenorDeTresMeses(){
		int meses = (new Date() - fechaDeNacimiento) / 30
		return meses < 3
	}

	Boolean estaEntre3y36Meses(){
		int meses = (new Date() - fechaDeNacimiento) / 30
		return meses > 2 && meses < 36
	}

	Boolean esMayorDe6Anios(){
		return this.getCategoriaPediatrico() == 'mayorDe6Anios'
	}

	Boolean esMenorDe6Anios(){
		return this.getCategoriaPediatrico() == 'menorDe6Anios'
	}

	Boolean esMenorDeUnAnio(){
		return this.getCategoriaPediatrico() == 'menorDeUnAnio'
	}

}
