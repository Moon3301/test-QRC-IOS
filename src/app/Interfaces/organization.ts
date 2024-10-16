export type Organization = {

    Id?: number
    Descr: string
    ManagerPhone: string
    SupervisorPhone: string
}

export type Building = {

    id: number
    descr: string
    organizationId: number
}

export type Tower = {

    id: number
    descr: string
    buildingId: number
}

export type OrganizationUser = {

    organizationId: number
    userId: string
    username: string
}

export type OrganizationCategory = {

    organizationId: number
    categoryId: number
    categoryName: string
}
