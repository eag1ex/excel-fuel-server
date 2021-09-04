export type PetrolProductPoinStatus = 'available' | 'not_available'

export interface PetrolPrices {
    price: number;
    currency: string;
    product_id: string;
}
export interface PetrolProductPoints {
    id: string | number
    status: PetrolProductPoinStatus
}

export interface PetrolProducts {
    product_id: string
    points: PetrolProductPoints[]
}

export interface PetrolModel {
    /** usually this param is assigned by db */
    id?: string;
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    prices: PetrolPrices[]
    products: PetrolProducts[]
    created_at?: Date;
    updated_at?: Date;
}

export interface PetrolUpdate{
    product_id: string;
    name: string;
    price: number;
}
