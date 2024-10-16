export type Maintenance = {

    equipmentId: number
    supervisorId: string
    supervisorName: string
    technicianId: string
    technicionName: string
    helperId: string
    helperName: string
    programed: string
    finished?: string
    status: MaintenanceStatus
    observation?: string
    ObservationVisibleInPdf: boolean
    images?: string

}

export enum MaintenanceStatus {

    Selecciona = 0,
    Asignada = 1,
    Iniciada = 2,
    Acceso = 3,
    Repuesto = 4,
    Finalizada = 5,

}

export const MaintenanceStatusOption = [
    {id: MaintenanceStatus.Selecciona, name: 'Selecciona'},
    {id: MaintenanceStatus.Asignada, name: 'Asignada'},
    {id: MaintenanceStatus.Iniciada, name: 'Iniciada'},
    {id: MaintenanceStatus.Acceso, name: 'Acceso'},
    {id: MaintenanceStatus.Finalizada, name: 'Finalizada'},
    
]

export type MaintenancePagination = {

    Entity: string;
    PageIndex: number;
    PageSize: number;
    PageCount: number;
    RecordCount: number;
    SortColumn: string;
    SortOrder: string;

}

export type MaintenanceFilter = {

    id?: number
    equipmentId: number
    organizationId: number
    categoryId: number
    physicalFile: string
    maintenanceStatus: MaintenanceStatus
    month: number
    year: number

}

export type MaintenanceFilterPagination = {
    Filter: MaintenanceFilter,
    Pagination: MaintenancePagination
}

export type MaintenanceLabor = {

    maintenanceId: number
    laborId: number
    finished: boolean
    
}

export type MaintenanceMeasurement = {

    maintenanceId: number
    measurementId: number
    measurementDescr: string
    partId?: number
    partDescr?: string
    measurementStepId: number
    measurementStepDescr: string
    measurementValue?: number

}


