export type Category = {

    id: number
    descr: string

}

export type CategoryLabor = {

    categoryId: number
    laborId: number
    sort: number
    accreditation: boolean

}

export type CategoryPart = {

    descr: string
    categoryId: number
    partId: number
    measurementId: number
    measurementDescr: string
    sort: number

}

export type CategoryStep = {

    descr: string
    categoryId: number
    stepId: number
    measurementId: number
    measurementDescr: string
    sort: number
    
}