export type PetrolProductPoinStatus = 'available' | 'not_available'

export interface PetrolPrices {
    price: number;
    currency: string;
    product_id: string;
}
export interface PetrolProductPoints {
    id: string
    status: PetrolProductPoinStatus
}

export interface PetrolProducts {
    product_id: string
    points: PetrolProductPoints[]
}

export interface PetrolModel {
    id: string
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    prices: PetrolPrices[]
    products: PetrolProducts[]
}
