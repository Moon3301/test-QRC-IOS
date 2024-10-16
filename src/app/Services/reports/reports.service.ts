import { Injectable } from '@angular/core';
import { api_url } from '../utilities';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private api: ApiService) { }

  async getPriorityGraphic(organizationId:number, month:number, year:number, shift:number){

    const endpoint = `${api_url}/get-priority-graphic`
    const method = 'POST'
    const body = {organizationId: organizationId, month:month, year: year, shift: shift}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getStatusGraphic(organizationId:number, month:number, year:number, shift:number){

    const endpoint = `${api_url}/get-status-graphic`
    const method = 'POST'
    const body = {organizationId: organizationId, month:month, year:year, shift: shift}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }
  









}
