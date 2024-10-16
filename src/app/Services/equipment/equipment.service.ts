import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Equipment, EquipmentPagination, EquipmentFilter, EquipmentCalendar, Shift, Priority, 
  EquipmentFilterPagination, EquipmentFilterMaintenanceSeed } from 'src/app/Interfaces/equipment';

import { ApiService } from '../api/api.service';

import { api_url } from '../utilities';
import { SecurityService } from '../Security/security.service';
import { MaintenanceFilter } from 'src/app/Interfaces/maintenance';

@Injectable({ 
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private api:ApiService, private security: SecurityService) { }

  async createEquipment(equipment:Equipment){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/equipments`
    const method = 'POST'
    const body = equipment

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async filterEquipments(EquipmentFilterPagination: EquipmentFilterPagination) {

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/equipments/filter`
    const method = 'POST'
    const body = EquipmentFilterPagination

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async updateEquipment(equipment:Equipment){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/equipments`
    const method = 'PUT'
    const body = equipment

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  // DELETE
  // Procedimiento de almacenado realiza un UPDATE sobre la tabla equipmentFilterTable

  async deleteEquipment(equipmentId:number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {id: `${equipmentId}`}
    const endpoint = `${api_url}/equipments`
    const method = 'DELETE'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async getEquipmentByOrganizationId(organizationId:number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = { organizationId: `${organizationId}`}
    const endpoint = `${api_url}/equipments`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async printReports(maintenanceFilter: MaintenanceFilter){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const endpoint = `${api_url}/documents/batch`
    const method = 'POST'
    const body = maintenanceFilter

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async historyEquipment(id: number, pagination: any){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const endpoint = `${api_url}/equipments/history`
    const method = 'POST'
    const body = {id, pagination}

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async physicalFileEquipment(search: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      search: `${search}`
    }

    const endpoint = `${api_url}/equipments/physicalfile`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  

  /*

  // GET
  async historyEquipment(id: number = 0, pageIndex:number = 1, pageSize = 10){

    // Obtiene el historial de mantenimientos de equipos de manera paginada. Devuelve info detallada de cada mantenimiento.

    const endpoint = `${api_url}/history-equipment`
    const method = 'POST'
    const body = {id:id, pageIndex: pageIndex, pageSize:pageSize}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  // UPDATE, GET
  async labelEquipment(equipmentId: number){

    // Realiza una actualizacion y una consulta a la tabla Equipment
    // Actualiza la columna QR de Equipment con el valor EquipmentId. Solo se actuliza cuando QR es 0 o NULL
    // Devuelve los registros del equipo y descripcion de las tablas Category y Organization. Filtra los resultados por el ID.
    // Se asegura que solo devuelva 1 solo registro.

    const endpoint = `${api_url}/label-equipment`
    const method = 'POST'
    const body = {equipmentId: equipmentId}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  // GET
  async getEquipmentPart(equipmentId: number, categoryId:number){

    // Procedimiento de almacenado EquipmentPartCollection
    // Obtiene los registros de la tabla EquipmentPart

    const endpoint = `${api_url}/get-equipment-part`
    const method = 'POST'
    const body = {equipmentId: equipmentId, categoryId: categoryId}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  // UPDATE, INSERT
  async updateEquipmentPart(equipmentId: number, partId: number, nominalValue: number){

    // Procedimiento de almacenado EquipmentPartUpdate
    // Actualiza e inserta los registros indicados en la tabla EquipmentPart
    // Si existe conincidencia con los valores equipmentId y PartId se actualiza el registro.
    // Si no existe coincidencia con los paramtros equipmentId y PartId se insertara un nuevo registro con los datos indicados.
    
    const endpoint = `${api_url}/update-equipment-part`
    const method = 'POST'
    const body = {equipmentId: equipmentId, partId: partId, nominalValue: nominalValue}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async ReadEquipmentByQR(qr: number){

    // Procedimiento de almacenado EquipmentReadByQR
    // Obtiene el equipo asociado al parametro 'QR'.

    const endpoint = `${api_url}/read-equipment-qr`
    const method = 'POST'
    const body = {qr:qr}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async ReadLastEquipmentByQR(qr: number){

    // Procedimiento de almacenado EquipmentReadLastByQR
    // Obtiene el ULTIMO equipo asociado al parametro 'QR'.

    const endpoint = `${api_url}/read-last-equipment-qr`
    const method = 'POST'
    const body = {qr:qr}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getPhysicalFile(search:string = '*'){

    const endpoint = `${api_url}/get-physicalfile-equipment`
    const method = 'POST'
    const body = {search:search}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  */

}
