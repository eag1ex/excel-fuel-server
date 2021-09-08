export type ExcelProductPoinStatus = 'available' | 'not_available'

export interface ExcelPrice {
    price: number | string;
    currency: string;
    product_id: string;
}
export interface ExcelProductPoints {
    id: string | number
    status: ExcelProductPoinStatus
}

export interface ExcelProduct {
    product_id: string
    points: ExcelProductPoints[]
}

export interface ExcelModel {
    /** usually this param is assigned by db */
    id?: string;
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    prices: ExcelPrice[]
    products: ExcelProduct[]
    created_at?: Date | string;
    updated_at?: Date | string;
}
