import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/Interfaces/cliente';
import { UsuariosService } from '../usuarios/usuarios.service';
import { User } from 'src/app/Interfaces/usuario';
import { ApiService } from '../api/api.service';
import { Category } from 'src/app/Interfaces/category-equip';

@Injectable({
  providedIn: 'root'
})

export class ClientesService {

  constructor(private usuarios: UsuariosService, private api:ApiService){}

  clientes: Cliente[] = [
    {id: 1, nombre: 'ACDATA', telefono_jefe_area: '+56 988943613', telefono_supervisor_area: '+56 913369488', usuarios: [], equipos: [] },
    {id: 2, nombre: 'MERCADO LIBRE', telefono_jefe_area: '+56 988943613', telefono_supervisor_area: '+56 913369488', usuarios: [], equipos: []},
    {id: 3, nombre: 'CLINICA LAS CONDES', telefono_jefe_area: '+56 988943613', telefono_supervisor_area: '+56 913369488', usuarios: [], equipos: []},
    {id: 4, nombre: 'CLINICA ALEMANA', telefono_jefe_area: '+56 988943613', telefono_supervisor_area: '+56 913369488', usuarios: [], equipos: []},
  ]

  addCliente(cliente: Cliente) {

    /*
    this.api.createRequest('add-cliente', 'POST', {
      cliente: cliente
    })
    */

    this.clientes.push(cliente);

  }

  assingUsuario(clienteId: number, usuario:User){
    
    /*
    this.api.createRequest('assing-user', 'POST', {
      clienteId: clienteId,
      usuario: usuario
    })
    */

    const cliente = this.clientes.find(c => c.id === clienteId);

    const usuarioId = usuario.id;
    const existe = cliente?.usuarios.find(u => u.id === usuarioId);

    if (cliente) {

      if(existe){
        console.log("Usuario ya esta asignado")
      }else{
        cliente.usuarios.push(usuario);
      }

    }

  }

  removeUsuario(clienteId: number, usuarioId: string): void {
    const cliente = this.findCliente(clienteId);
    if (cliente) {
      cliente.usuarios = cliente.usuarios.filter(u => u.id !== usuarioId);
    }
  }

  assignEquipo(clienteId: number, equipo: Category){

    const cliente = this.clientes.find(c => c.id === clienteId);

    if(cliente){

      const equipoId = equipo.id
      const existe = cliente?.equipos.find(u => u.id === equipoId)

      if(existe){
        console.log("Usuario ya esta asignado")
      }else{
        cliente.equipos.push(equipo)
        console.log(cliente.equipos)
      }

    }

  }

  removeEquipo(clienteId: number, equipoId: number): void {
    const cliente = this.findCliente(clienteId);
    if (cliente) {
      cliente.equipos = cliente.equipos.filter(u => u.id !== equipoId);
    }
  }

  updateCliente(id: number, updatedCliente: Cliente) {

    /*
    this.api.createRequest('update-client', 'POST', {
      idClient: id,
      client: updatedCliente
    })
    */

    const index = this.clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
      this.clientes[index] = updatedCliente;
    }

    
  }

  deleteCliente(id: number) {
    
    /*
    this.api.createRequest('delete-client', 'POST',{
      id: id
    })
    */

    this.clientes = this.clientes.filter(cliente => cliente.id !== id);

  }

  listClientes() {

    /*
    this.api.createRequest('list-clients', 'GET', {
      
    })
    */
    
    return this.clientes;

  }

  findCliente(id: number) {
    return this.clientes.find(cliente => cliente.id === id);
  }

}
