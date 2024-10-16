import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { SecurityService } from '../Security/security.service';
import { api_url } from '../utilities';


interface FilterStatus {

  organizationId: number,
  month: number,
  year: number,
  shift: number

}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private api:ApiService, private security:SecurityService) { }

  async getGraphicStatus(filter:FilterStatus){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const endpoint = `${api_url}/graphic/status`
    const method = 'POST'
    const body = filter

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async getGraphicPriority(filter:FilterStatus){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.');
      return null;
    }

    const endpoint = `${api_url}/graphic/priority`
    const method = 'POST'
    const body = filter

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }









}
