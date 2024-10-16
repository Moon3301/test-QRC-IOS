import { Injectable } from '@angular/core';
import { Organization, Building, Tower } from 'src/app/Interfaces/organization';
import { ApiService } from '../api/api.service';
import { api_url } from '../utilities';
import { SecurityService } from '../Security/security.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  
  constructor(private api:ApiService, private security: SecurityService) {}

  async getOrganizations(): Promise<any>{

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/organizations`;
    const method = 'GET'
    const body = undefined
    
    const response = await this.api.createRequest(endpoint, method, body, token);
    const organizacion = response.data

    return organizacion

  }

  async addOrganization(organization: Organization): Promise<any> {

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/organizations`;
    const method = 'POST';
    const body = organization

    const response = await this.api.createRequest(endpoint, method, body, token);
    return response
  }

  async updateOrganization(organization: Organization) {
    
    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/organizations`;
    const method = 'PUT';
    const body = organization

    return this.api.createRequest(endpoint, method, body, token);
  }

  async deleteOrganization(organizationId: number) {

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {organizationId: `${organizationId}`}
    const endpoint = `${api_url}/organizations`;
    const method = 'DELETE';
    const body = null;

    return this.api.createRequest(endpoint, method, body, token, queryParams);
  }

  async findOrganization(organizationId: number) {

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = { organizationId: `${organizationId}`}
    const endpoint = `${api_url}/organizations`;
    const method = 'GET';
    const body = null

    return this.api.createRequest(endpoint, method, body, token, queryParams);
  }

  async findUsersByOrganizationId(organizationId: number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = { organization: `${organizationId}`}
    const endpoint = `${api_url}/organizations/users`;
    const method = 'POST';
    const body = null

    return this.api.createRequest(endpoint, method, body, token, queryParams);

  }

  async assignUserToOrganization(user: string, organization: number) {

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      organization: `${organization}`,
      user: `${user}`
    }

    const endpoint = `${api_url}/organizations/user/assign`;
    const method = 'POST';
    const body = undefined;

    return this.api.createRequest(endpoint, method, body, token, queryParams);
  }

  async unassignUserFromOrganization(user: string, organization: number) {

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      organization: `${organization}`,
      user: `${user}`
    }

    const endpoint = `${api_url}/organizations/user/unassign`;
    const method = 'POST';
    const body = undefined;

    return this.api.createRequest(endpoint, method, body, token, queryParams);
  }

  async assignCategoryToOrganization(organization: number, category: number) {
  
    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      organization: `${organization}`,
      category: `${category}`
    }

    const endpoint = `${api_url}/organizations/category/assign`;

    const method = 'POST';
    const body = undefined;

    return this.api.createRequest(endpoint, method, body, token, queryParams);
  }

  async unassignCategoryFromOrganization(category: number, organization: number) {
    
    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {
      organization: `${organization}`,
      category: `${category}`
    }

    const endpoint = `${api_url}/organizations/category/unassign`;
    const method = 'POST';
    const body = undefined;

    return this.api.createRequest(endpoint, method, body, token, queryParams);
  }

  


}
