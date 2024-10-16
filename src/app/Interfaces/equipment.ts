export type Equipment = {

  Id?: number;
  QR?: number;
  OrganizationId: number;
  Organization: string;
  Shift: Shift;
  Priority: Priority;
  CategoryId: number;
  Category: string;
  Descr: string;
  Location: string;
  PhysicalFile: string;
  Asset: string;
  Serial: string;
  Brand: string;
  Model: string;
  Accreditation: boolean;
  HasObservation: boolean;
  Deleted: boolean;
  Calendar: EquipmentCalendar;
  LastMaintenance: string;
  Programmed: string;
  Images: string;
  HasImages: boolean | null;
}

export type EquipmentPagination = {

  Entity: string;
  PageIndex: number;
  PageSize: number;
  PageCount: number;
  RecordCount: number;
  SortColumn: string;
  SortOrder: string;

}

export type EquipmentFilter = {

  Id?: number;
  OrganizationId: number;
  Priority: Priority;
  Shift: Shift;
  CategoryId: number;
  Calendar: EquipmentCalendar;
  Asset: string;
  Descr: string;
  Location: string;
  PhysicalFile: string;
  Serial: string;
  Brand: string;
  Model: string;
  Accreditation: boolean;
  Month: number;
  Pagination?: EquipmentPagination
}

export type EquipmentFilterPagination = {
  Filter: EquipmentFilter;
  Pagination:EquipmentPagination
}

export type MaintenanceSeed = {
  SupervisorId: string;
  TechnicianId: string;
  HelperId: string;
  Programmed: Date | null;
}

export type EquipmentFilterMaintenanceSeed = {
  Filter: EquipmentFilter;
  Seed: MaintenanceSeed;
}

export type EquipmentPart = {

  id: number;
  equipmentId: number;
  partId: number;
  nominalValue: number;
}

export interface EquipmentItem {
  qr: number;
  organizationId: number;
  buildingId: number;
  towerId: number;
  organization: string;
  building: string;
  tower: string;
  shift: Shift;
  priority: Priority;
  categoryId: number;
  category: string;
  descr: string;
  location: string;
  physicalFile: string;
  asset: string;
  serial: string;
  brand: string;
  model: string;
  accreditation: boolean;
  hasObservation: boolean;
  deleted: boolean;
  calendar: EquipmentCalendar;
  lastMaintenance: string;
  programmed: string;
  images: string;
  hasImages: boolean;
}

export enum EquipmentCalendar {
  Selecciona = 0,
  Quincenal = 15,
  Mensual = 1,
  Bimestral = 2,
  Trimestral = 3,
  Cuatrimestral = 4,
  Semestral = 6,
  Anual = 12
}

export enum Shift {
  Selecciona = 0,
  DIA = 1,
  NOCHE = 2
}

export enum Priority {
  Selecciona = 0,
  UNO = 1,
  DOS = 2,
  TRES = 3,
  CUATRO = 4
}

export const shiftOptions = [
  { id: Shift.Selecciona, name: 'Selecciona' },
  { id: Shift.DIA, name: 'DIA' },
  { id: Shift.NOCHE, name: 'NOCHE' }
];

export const priorityOptions = [
  { id: Priority.Selecciona, name: 'Selecciona' },
  { id: Priority.UNO, name: '1' },
  { id: Priority.DOS, name: '2' },
  { id: Priority.TRES, name: '3' },
  { id: Priority.CUATRO, name: '4' }
];

export const equipmentCalendarOptions = [
  { id: EquipmentCalendar.Selecciona, name: 'Selecciona' },
  { id: EquipmentCalendar.Quincenal, name: 'Quincenal' },
  { id: EquipmentCalendar.Mensual, name: 'Mensual' },
  { id: EquipmentCalendar.Bimestral, name: 'Bimestral' },
  { id: EquipmentCalendar.Trimestral, name: 'Trimestral' },
  { id: EquipmentCalendar.Cuatrimestral, name: 'Cuatrimestral' },
  { id: EquipmentCalendar.Semestral, name: 'Semestral' },
  { id: EquipmentCalendar.Anual, name: 'Anual' }
];

export const months = [

  { id: 1, name: 'Enero'},
  { id: 2, name: 'Febrero'},
  { id: 3, name: 'Marzo'},
  { id: 4, name: 'Abril'},
  { id: 5, name: 'Mayo'},
  { id: 6, name: 'Junio'},
  { id: 7, name: 'Julio'},
  { id: 8, name: 'Agosto'},
  { id: 9, name: 'Septiembre'},
  { id: 10, name: 'Octubre'},
  { id: 11, name: 'Noviembre'},
  { id: 12, name: 'Diciembre'},
]

export const years = [

  { id: 2018, name: '2018'},
  { id: 2019, name: '2019'},
  { id: 2020, name: '2020'},
  { id: 2021, name: '2021'},
  { id: 2022, name: '2022'},
  { id: 2023, name: '2023'},
  { id: 2024, name: '2024'},
  { id: 2025, name: '2025'},
  
]
