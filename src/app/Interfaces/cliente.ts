import { User } from "./usuario"
import { Category } from "./category-equip"

export interface Cliente {

    id: number
    nombre: string
    telefono_jefe_area: string
    telefono_supervisor_area: string
    usuarios: User[]
    equipos: Category[]
    
}


