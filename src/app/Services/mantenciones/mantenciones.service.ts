import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { MaintenanceFilterPagination } from 'src/app/Interfaces/maintenance';
import { EquipmentFilterMaintenanceSeed } from 'src/app/Interfaces/equipment';

import { api_url } from '../utilities';
import { SecurityService } from '../Security/security.service';
@Injectable({
  providedIn: 'root'
})

export class MantencionesService {

  constructor(private api:ApiService, private security: SecurityService) { }

  async createMaintenanceBatch(EquipmentFilterMaintenanceSeed: EquipmentFilterMaintenanceSeed){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const endpoint = `${api_url}/maintenances/batch`
    const method = 'POST'
    const body = EquipmentFilterMaintenanceSeed

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async filterMaintenances(maintenanceFilterPagination: MaintenanceFilterPagination){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/maintenances/filter`
    const method = 'POST'
    const body = maintenanceFilterPagination

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async workMaintenances(id:number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id: `${id}`,
    }

    const endpoint = `${api_url}/maintenances/work`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async workQRMaintenance(id:number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id: `${id}`,
    }

    const endpoint = `${api_url}/maintenances/workqr`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async updateMaintenanceLabor(id: number, manintenanceId: number, finished: boolean){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id:id,
      manintenanceId: manintenanceId,
      finished: finished
    }

    const endpoint = `${api_url}/maintenances/labor`
    const method = 'PUT'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async updateMaintenanceMeasurement(id: number, value: number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id:id,
      value: value
    }

    const endpoint = `${api_url}/maintenances/measurement`
    const method = 'PUT'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async updateMaintenanceObservation(id:number, observation: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id:id,
      observation: observation
    }

    const endpoint = `${api_url}/maintenances/observation`
    const method = 'PUT'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async updateMaintenanceVisibleInPDF(id:number, visible: boolean){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id:id,
      visible: visible
    }

    const endpoint = `${api_url}/maintenances/visibleinpdf`
    const method = 'PUT'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async updateMaintenanceImages(id:number, image:string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id:id,
      image: image
    }

    const endpoint = `${api_url}/maintenances/images`
    const method = 'PUT'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async updateMaintenanceFinish(id:number, equipmentId:number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      id:id,
      equipmentId: equipmentId
    }

    const endpoint = `${api_url}/maintenances/finish`
    const method = 'PUT'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }


























  async filterPrintMaintenance(id: number = 0, equipmentId: number = 0, organizationId:number = 0, categoryId: number = 0,
  physicalFile: string = '', status: number, month: number, year: number){

    // Procedimiento de almacenado MaintenanceFilterPrint
    // 

    const endpoint = `${api_url}/filter-print-maintenance`
    const method = 'POST'
    const body = {id:id, equipmentId: equipmentId, organizationId: organizationId, categoryId: categoryId, physicalFile: physicalFile, 
    status: status, month: month, year: year}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getMaintenanceByQr(qr: number){

    // Procedimiento de almacenado MaintenanceIdByQr
    // Obtiene un mantenimiento asociado al parametro indicado 'qr' 

    const endpoint = `${api_url}/get-maintenance-qr`
    const method = 'POST'
    const body = {qr:qr}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async updateMaintenanceImage(id: number, image:string){

    const endpoint = `${api_url}/update-maintenance-image`
    const method = 'POST'
    const body = {id:id, image: image}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getFullMaintenance(maintenanceId: number){

    const endpoint = `${api_url}/get-full-maintenance`
    const method = 'POST'
    const body = {maintenanceId:maintenanceId}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async updateMaintenanceStatus(id:number, status: number){

    const endpoint = `${api_url}/update-maintenance-status`
    const method = 'POST'
    const body = {id:id, status:status}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getMaintenanceWork(id:number){

    const endpoint = `${api_url}/get-maintenance-work`
    const method = 'POST'
    const body = {id:id}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getMeasurement(){

    const endpoint = `${api_url}/get-measurement`
    const method = 'GET'
    const body = {}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }
  
  async getMonthHistoryMaintenance(month: number, year: number){

    const endpoint = `${api_url}/month-history-maintenance`
    const method = 'POST'
    const body = {month: month, year: year}

    const response = await this.api.createRequest(endpoint, method, body)
    return response


  }

  async VisiblePdfUpdate(id: number, visible: boolean){

    const endpoint = `${api_url}/visible-pdf-update`
    const method = 'POST'
    const body = {id:id, visible:visible}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async ChangeMaintenanceCalendar(equipmentId:number, calendar:number){

    const endpoint = `${api_url}/change-maintenance-calendar`
    const method = 'POST'
    const body = {equipmentId:equipmentId, calendar:calendar}

    const response = await this.api.createRequest(endpoint, method, body)
    return response
    
  }

  






}
