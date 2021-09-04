/**
 * @description Our static database, initially loaded from file and storing new changes to local variable in active session
 */

import { PetrolModel, PetrolUpdate } from '@api/interfaces'
import { namePriceProdID, petrolItem, uid } from '../../utils'
import { matched } from 'x-utils-es/umd'

export class StaticDB {
    constructor() {}
    private staticList: PetrolModel[] = undefined as any

    /** propagate staticList, add {updated_at,created_at} to each item  */
    petrolList(): Promise<PetrolModel[]> {
        // as long its not undefined
        if (this.staticList) return Promise.resolve(this.staticList)
        try {
            return import('./petrol-list.json').then((n) => {
                let list: PetrolModel[] = n.default as any
                list = list.map((x) => {
                    return {
                        ...x,
                        // initialize dates
                        updated_at: new Date(),
                        created_at: new Date(),
                    }
                })
                this.staticList = list
                return list
            }) as any
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** return all petrol stations that match by {product_id[]} */
    async petrolListAllByProdID(product_ids: Array<string | number>): Promise<PetrolModel[]> {
        try {
            if (!(product_ids || []).length) throw new Error(`petrolListAllByProdID {product_ids} not set`)
            // call initialy if for the first time
            product_ids = [].concat(product_ids as any)
            product_ids = product_ids.filter((n) => !!n)
            await this.petrolList()
            const o: any[] = [] // << output
            const found = (prod_ids: any[], item) => (item.products || []).filter((x) => prod_ids.filter((y) => x.product_id === y).length).length

            for (const item of this.staticList) {
                if (found(product_ids, item)) {
                    o.push(item)
                }
            }

            if (!o.length) return []
            else return o
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** return petrol item by {product_id}  */
    async petrolItemByProdID(id: string, product_id: string): Promise<PetrolModel> {
        try {
            if (!product_id || !id) throw new Error(`petrolItemByProdID {product_id}, or {id} not set`)
            // call initialy if for the first time
            await this.petrolList()
            let o // << output
            const found = (prod_id, item) => (item.products || []).filter((n) => n.product_id === prod_id).length

            for (const item of this.staticList) {
                if (item.id === id) {
                    if (found(product_id, item)) {
                        o = item
                    }
                    break
                }
            }
            return o
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** return petrol item by {id}  */
    async petrolItemByID(id: string): Promise<PetrolModel> {
        try {
            if (!id) throw new Error(`petrolItemByID {id} not set`)
            // call initialy if for the first time
            await this.petrolList()
            let o // << output
            for (const item of this.staticList) {
                if (item.id === id) {
                    o = item
                    break
                }
            }
            return o
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     *   Add new petrol item to staticList, all fields are required except for: {created_at,updated_at,id}
     * - Do not allow creating if same latitude/longitude already exist
     * - Do not allow creating if same address/city already exist
    */
    async createPetrolItem(data: PetrolModel): Promise<PetrolModel> {
        try {
            // call initialy if for the first time
            await this.petrolList()
            if (!petrolItem(data)) throw new Error('createPetrolItem, invalid {data} provided')
            else {
                // check if some details alrady exist
                let exists = false
                for (const item of this.staticList){
                    if (item.latitude === data.latitude && data.longitude === item.longitude ){
                        exists = true
                        break
                    }
                    const addressA = (item.address + item.city).toLowerCase()
                    const addressB = (data.address + data.city).toLowerCase()
                    if (matched(addressA, new RegExp(addressB, 'gi'))){
                        exists = true
                        break
                    }
                }

                if (exists){
                    throw new Error(('Item already exists, check your {address,latitude,longitude} properties'))
                }

                const nData: PetrolModel = {
                    ...data,
                    id: uid(),
                    created_at: new Date(),
                    updated_at: new Date(),
                }
                this.staticList.push(nData)
                return this.staticList[this.staticList.length - 1]
            }
            //
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** search item in staticList, make update, and only return that item*/
    async updatePetrolItem(id: string, data: PetrolUpdate): Promise<PetrolModel> {
        try {
            if (!namePriceProdID(data)) throw new Error('updatePetrolItem, Invalid data')
            // call initialy if for the first time
            await this.petrolList()
            let updatedItem
            this.staticList.forEach((item) => {
                if (item.id === id) {
                    item.name = data.name
                    // find and update one product price
                    item.prices = (item.prices || []).map((x) => {
                        if (x.product_id === data.product_id) {
                            x.price = Number(data.price)
                        }
                        return x
                    })
                    updatedItem = item
                    item.updated_at = new Date()
                }
            })
            return Promise.resolve(updatedItem)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** delete any number of items from staticList by ids[]  */
    async deletePetrolItems(ids: Array<string | number>): Promise<Array<string>> {
        try {
            if (!(ids || []).length) throw new Error('deletePetrolItems, no ids provided')

            ids = [].concat(ids as any)
            ids = ids.filter((n) => !!n)
            // call initialy if for the first time
            await this.petrolList()
            const deletedItems: any[] = [] // list of deleted items by id

            for (const id of ids) {
                // we should always have one/uniq id. but because of static db, we check for all anyway
                const inxs: Array<number> = this.staticList.map((x, index) => (x.id === id ? index : undefined)).filter((x) => x !== undefined) as any

                let deleted = 0
                inxs.forEach((dbIndex) => {
                    this.staticList.splice(dbIndex, 1)
                    deleted++
                })
                if (deleted) deletedItems.push(id)
            }
            return deletedItems
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

/**
 * NOTE new test examples
 * uncomment each line for testing
 * to createPetrolItem must provide dummy data
 *
 * */
// const staticDB = new StaticDB()
// staticDB.petrolItemByID('61335ac2faf7da2be5d966db').then(console.log).catch(console.error)
// staticDB.petrolItemByProdID('61335ac2faf7da2be5d966db', 'DIESEL').then(console.log).catch(console.error)
// staticDB.petrolListAllByProdID(['DIESEL', 'BENZIN']).then(console.log).catch(console.error)
// staticDB.updatePetrolItem('61335ac2faf7da2be5d966db', {name: 'Migrol Tankstelle (alt)', price: 0, product_id: 'DIESEL'}).then(console.log).catch(console.error)
// staticDB.deletePetrolItems(['61335ac2faf7da2be5d966db','61335ac2faf7da2be5a0dad3']).then(console.log).catch(console.error)
// staticDB.createPetrolItem(dummydata).then(console.log).catch(console.error)
// staticDB.petrolList().then(console.log).catch(console.error)
