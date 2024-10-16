import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/Interfaces/cliente';
import { Cargo } from 'src/app/Interfaces/cargo';
import { User } from 'src/app/Interfaces/usuario';
import { Category } from 'src/app/Interfaces/category-equip';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor() { }

  private equipos: Category[] = [

    { id: 1, name: "PURIFICADOR" },
    { id: 2, name: "UNIDAD MANEJADORA DE AIRE" },
    { id: 3, name: "VENTILADOR INYECTOR DE AIRE" },
    { id: 4, name: "FAN COIL" },
    { id: 5, name: "REFRIGERADOR" },
    { id: 6, name: "MINI SPLIT" },
    { id: 7, name: "SPLIT DUCTO" },
    { id: 8, name: "VRV - UI" },
    { id: 9, name: "VENTILADOR EXTRACTOR DE AIRE" },
    { id: 10, name: "SPLIT CASSETTE" },
    { id: 11, name: "COMPACTO" },
    { id: 12, name: "CONGELADOR" },
    { id: 13, name: "VRV - UE" },
    { id: 14, name: "MULTI SPLIT" },
    { id: 15, name: "VITRINA" },
    { id: 16, name: "VENTANA" },
    { id: 17, name: "SPLIT MURO" },
    { id: 18, name: "ROOF TOP" },
    { id: 19, name: "VEX" },
    { id: 20, name: "SPLIIT DUCTO" },
    { id: 21, name: "FREEZER" },
    { id: 22, name: "SPLIT" },
    { id: 23, name: "CORTINA" },
    { id: 24, name: "CORTINA DE AIRE" },
    { id: 25, name: "MAQUINA DE HIELO" },
    { id: 26, name: "SPLIT BAJA SILUETA" },
    { id: 27, name: "EQUIPO ROOF TOP" },
    { id: 28, name: "SPLIT PISO CIELO" },
    { id: 29, name: "SPLIT CASSETE" },
    { id: 30, name: "SPLIT VENTANA" },
    { id: 31, name: "VENTILADOR INYECCION DE AIRE" },
    { id: 32, name: "EVAPORADOR (IU)" },
    { id: 33, name: "CASSETTE/CAMARA" },
    { id: 34, name: "EVAPORADOR (UI)" },
    { id: 35, name: "EVAPORADOR 1 (UNIDAD INTERIOR)" },
    { id: 36, name: "EVAPORADOR 2 (UNIDAD INTERIOR)" },
    { id: 37, name: "CASSETTE/CAMARA (IU)" },
    { id: 38, name: "CENTRAL COMPACTO" },
    { id: 39, name: "SUPPLY COLD AIR TO DATA ROOM" },
    { id: 40, name: "SUPPLY COLD AIR TO ELECTRICAL ROOM" },
    { id: 41, name: "FRESH AIR FAN TO OFFICE AREA" },
    { id: 42, name: "CASSETTE" },
    { id: 43, name: "EQUIPO MOCHILA" }
  ];

  listEquipos(): Category[] {

    return this.equipos
  }

  // Add a new equipo
  add(equipo: Category): void {

    this.equipos.push(equipo);

  }

  // Update an existing equipo by id
  update(id: number, updatedEquipo: Partial<Category>): void {
    const index = this.equipos.findIndex(equipo => equipo.id === id);
    if (index !== -1) {
      this.equipos[index] = { ...this.equipos[index], ...updatedEquipo };
    }
  }

  // Delete an equipo by id
  delete(id: number): void {
    this.equipos = this.equipos.filter(equipo => equipo.id !== id);
  }

  // Find equipos by name (case insensitive)
  find(id: number): Category | undefined {
    return this.equipos.find(equipo => equipo.id === id)
  }

}
