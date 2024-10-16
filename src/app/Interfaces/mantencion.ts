export type Equipment = {

    id: number
    QR: number
    organization_id: number
    building_id: number
    tower_id: number
    shift: number
    priority: number
    category_id: number
    description: string
    location: string
    physical_file: string
    asset: string
    brand: string
    model: string
    serial: string
    acreditation: boolean
    calendar: number
    last_maintenance: string
    next_maintenance: string
    deleted: boolean 

}

export type EquipementPart = {

    id: number
    equipment_id: Equipment
    part_id: number
    nominal_value: number
}

export enum Turno {

    Dia = "Dia",
    Noche = "Noche"

}

export enum Criticidad {

    uno = "1",
    dos = "2",
    tres = "3",
    cuatro = "4"

}

export enum Periodicidad {

    mensual = "Mensual",
    bimestral = "Bimestral",
    trimestral = "Trimestral",
    cuatrimestral = "Cuatrimestral",
    semestral = "Semestral",
    anual = "Anual",
    quincenal = "Quincenal"

}




