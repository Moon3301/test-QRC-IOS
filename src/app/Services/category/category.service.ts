import { Injectable } from '@angular/core';
import { api_url } from '../utilities';

import { ApiService } from '../api/api.service';
import { SecurityService } from '../Security/security.service';
import { Category } from 'src/app/Interfaces/category-equip';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private api: ApiService, private security: SecurityService) { }

  async getCategories(){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/categories`
    const method = 'GET'
    const body = undefined

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }

  async addCategory(category: Category){
    
    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const endpoint = `${api_url}/categories`
    const method = 'POST'
    const body = category

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  /*
  async getCategoryByName(categoryName: string){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {categoryName: `${categoryName}`}
    const endpoint = `${api_url}/categories`
    const method = 'GET'
    const body = null

    const response = await this.api.createRequest(endpoint, method, body, token)
    return response

  }
  */

  async getCategoryByOrganization(organizationId: number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {organization: `${organizationId}`}
    const endpoint = `${api_url}/categories`
    const method = 'GET'
    const body = null

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async deleteCategory(categoryId:number){

    this.security.loadToken();
    const token = this.security.currentToken

    if (!token) {
      console.error('Token no encontrado o inválido.'); 
      return null;
    }

    const queryParams = {category: `${categoryId}`}
    const endpoint = `${api_url}/categories`
    const method = 'DELETE'
    const body = null

    const response = await this.api.createRequest(endpoint, method, body, token, queryParams)
    return response

  }

  async getLaborByCategoryId(categoryId:number){

    // Procedimiento de almacenado CategoryLabor
    // Devuelve registros de la tabla Labor y Category Labor
    // Devuelve los registros de la tabla CategoryLabor y labor asociados al ID de la categoria
    // que se indico en el parametro

    const endpoint = `${api_url}/labor/${categoryId}`
    const method = 'GET'
    const body = null

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async createCategoryLabor(categoryLaborId:number = 0){

    // Procedimiento de almacenado CategoryLaborCreate
    // Consultar rene como funciona procedimiento

    const endpoint = `${api_url}/category-labor/`
    const method = 'POST'
    const body = {categoryLaborId: categoryLaborId}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async updateCategoryLabor(categoryLaborId:number = 0, categoryId: number = 0, laborId:number = 0, sort:number = 0){

    // Procedimiento de almacenado CategoryLaborUpdate

    const endpoint = `${api_url}/category-labor/${categoryLaborId}`
    const method = 'PUT'
    const body = {categoryId: categoryId, laborId: laborId, sort: sort}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async getCategoryPart(categoryId:number){

    // Procedimiento de almacenado CategoryPartCollection
    // Obtiene los registros de la tabla CategoryPart asociados a el ID de la categoria indicada en el parametro de entrada.

    const endpoint = `${api_url}/category-part/${categoryId}`
    const method = 'GET'
    const body = null

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async createCategoryPart(categoryId:number = 0){

    // Procedimiento de almacenado CategoryPartCreate
    // Crea un nuevo registro en la tabla CategoryPart
    // Si el parametro de entrada es igual a 0, borra todos los registros asociados al ID de la tabla CategoryPart

    const endpoint = `${api_url}/category-part`
    const method = 'POST'
    const body = {categoryId:categoryId}

    const response = await this.api.createRequest(endpoint, method, body)
    return response


  }

  async getCategoryStep(categoryId: number){

    // Procedimiento de almacenado CategoryStep
    // Obtiene los registros asociados al parametro indicado de la tabla CategoryStep

    const endpoint = `${api_url}/category-step/${categoryId}`
    const method = 'GET'
    const body = null

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

  async createCategoryStep(categoryId: number){

    // procedimiento de almacenado CategoryStepCreate
    // Crea un nuevo registro en la tabla CategoryStep

    const endpoint = `${api_url}/category-step`
    const method = 'POST'
    const body = {categoryId:categoryId}

    const response = await this.api.createRequest(endpoint, method, body)
    return response

  }

}
