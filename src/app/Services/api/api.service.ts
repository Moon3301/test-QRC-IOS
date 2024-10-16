import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  async createRequest(endpoint: string, _method: string, body: any, token?: string, queryParams?: Record<any, any>): Promise<any> {

    try {
      const headers: HeadersInit = {
          'Content-Type': 'application/json',
      };

      if (token) {
          headers['Authorization'] = `Bearer ${token}`;
      }

      // Construir la URL con los parámetros de consulta si se proporcionan
      let url = endpoint;
      if (queryParams) {
          const queryString = new URLSearchParams(queryParams).toString();
          url += `?${queryString}`;
      }

      const response = await fetch(url, {
          method: _method,
          headers: headers,
          body: body ? JSON.stringify(body) : undefined 
      });

      const status = response.status;    

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');

        if (!contentType) {
            return {
                data: null, // No hay contenido
                status
            };
        }

        // Verificar si el tipo de contenido es JSON
        if (contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            return {
                data: jsonResponse,
                status
            };
        }

        // Si es un archivo, manejarlo como blob (por ejemplo, para PDF)
        if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
            const blobResponse = await response.blob();
            return {
                data: blobResponse, // Podrías devolver el blob directamente o hacer algo más con él
                status
            };
        }

        // Para texto plano o HTML
        return {
            data: await response.text(), 
            status
        };

      } else {
        // Si la respuesta no es OK, manejar el error
        const contentType = response.headers.get('Content-Type');
        let errorResponse;

        if (contentType && contentType.includes('application/json')) {
            // Intentar parsear como JSON en caso de error
            errorResponse = await response.json();
        } else {
            // Si no es JSON, obtener como texto
            errorResponse = await response.text();
        }

        return {
            error: errorResponse || "Error al obtener datos de la solicitud",
            status
        };
      }

    } catch (error: any) {
      return {
        error: error.message || 'Error al realizar la solicitud',
        status: 0,
      };
    } 
  }

  /* EJEMPLO DE USO

  GET
  async fetchData() {
    const response = await this.apiService.createRequest('some-endpoint', 'GET', null);

    if (response.data) {
      console.log('Data:', response.data);
    } else {
      console.error('Error:', response.error);
    }

    console.log('Status:', response.status);
  }

  POST
  async postData() {
    const body = { key: 'value' };
    const response = await this.apiService.createRequest('some-endpoint', 'POST', body);

    if (response.data) {
      console.log('Data:', response.data);
    } else {
      console.error('Error:', response.error);
    }

    console.log('Status:', response.status);
  }


  */

}
