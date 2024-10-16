import { Injectable } from '@angular/core';
import { MaintenanceFilter } from 'src/app/Interfaces/maintenance';
import { ApiService } from '../api/api.service';
import { api_url } from '../utilities';
import { SecurityService } from '../Security/security.service';

@Injectable({
  providedIn: 'root'
})

export class DocumentsService {

  constructor(private api:ApiService, private security:SecurityService) { }
  
  async getFiles(directory:string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      path: `${directory}`
    }

    console.log('Enviando queryParams: ',queryParams)
    const endpoint = `${api_url}/documents/files`
    const method = 'GET'
    const body = undefined;

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    console.log('getFiles: ',response)
    return response

  }

  async directoryDocument(directory?:string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      path: `${directory}`
    }

    console.log('Enviando queryParams: ',queryParams)
    const endpoint = `${api_url}/documents/directories`
    const method = 'GET'
    const body = undefined;

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async saveDocument(){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const endpoint = `${api_url}/documents/save`
    const method = 'POST'
    const body = undefined;

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async downloadDocument(file:string, type: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      file: `${file}`,
      type: `${type}`
    }

    const endpoint = `${api_url}/documents/download`
    const method = 'GET'
    const body = undefined;

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async batchDocuments(maintenanceFilter: MaintenanceFilter){

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

  async printReports(maintenance: number, directory: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      maintenance: `${maintenance}`,
      directory: `${directory}`
    }

    const endpoint = `${api_url}/documents/print`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async monthDocuments(month: number, year: number, directory: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      month: `${month}`,
      year: `${year}`,
      directory: `${directory}`
    }

    const endpoint = `${api_url}/documents/month`
    const method = 'POST'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async historyDocuments(id:number, directory: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      id: `${id}`,
      directory: `${directory}`
    }

    const endpoint = `${api_url}/documents/history`
    const method = 'POST'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async labelDocuments(equipmentId: number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const queryParams = { 
      equipmentId: `${equipmentId}`,
    }

    const endpoint = `${api_url}/documents/label`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }










  
}
