
/**
 * @description Our static database, is loaded from file and storing new changes to local variable in active session
 * - Each session can be assigned to different user
 */

import { ExcelModel, ExcelProduct } from '@api/interfaces'
import {excelItem, uid, excelItemUpdate } from '../../utils'
import { copy, log, matched, onerror } from 'x-utils-es/umd'
import config from '../../config'
interface UserStaticStations {
    [name: string]: ExcelModel[]
}

export class StaticDB {
    /** user assigned to database */
    private userName: string
    private userStaticExcelStations: UserStaticStations = {}

    private staticExcelProducts: ExcelProduct[] = undefined as any

    // preset our username for now
    constructor(userName: string = config.staticDB.username) {
        this.userName = userName
        if (!this.userName) {
            onerror('StaticDB requires {userName} but missing?')
        }
    }

    set staticExcelStations(val) {
        log('staticExcelStations/database updated', (val || []).length)
        this.userStaticExcelStations[this.userName] = val
    }

    get staticExcelStations(): ExcelModel[] {
        return this.userStaticExcelStations[this.userName]
    }

    /**
     * All available Excel products on offer, can be added to each Excel station
     */
    async excelProducts(): Promise<ExcelProduct[]> {
        if (this.staticExcelProducts) return this.staticExcelProducts
        try {
            return import('./excel-products.json').then((n) => {
                const list: ExcelProduct[] = n.default as any
                this.staticExcelProducts = list
                return list
            })
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * propagate staticExcelStations, added {updated_at,created_at} to each item
     *
     */
    async excelStations(): Promise<ExcelModel[]> {
        // as long its not undefined
        if (this.staticExcelStations) return Promise.resolve(this.staticExcelStations)
        try {
            return import('./excel-stations.json').then((n) => {
                let list: ExcelModel[] = n.default as any
                list = list.map((x) => {
                    return {
                        ...x,
                        // initialize dates
                        updated_at: new Date(),
                        created_at: new Date(),
                    }
                })
                this.userStaticExcelStations[this.userName] = copy(list)
                return this.userStaticExcelStations[this.userName]
            })
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** return all excel stations that match by {product_id[]} */
    // async excelStationsByProdID(product_ids: Array<string | number>): Promise<ExcelModel[]> {
    //     try {
    //         if (!(product_ids || []).length) throw new Error(`excelStationsByProdID {product_ids} not set`)
    //         // call initialy if for the first time
    //         product_ids = [].concat(product_ids as any)
    //         product_ids = product_ids.filter((n) => !!n)
    //         await this.excelStations()
    //         const o: any[] = [] // << output
    //         const found = (prod_ids: any[], item) => (item.products || []).filter((x) => prod_ids.filter((y) => x.product_id === y).length).length

    //         for (const item of this.staticExcelStations) {
    //             if (found(product_ids, item)) {
    //                 o.push(item)
    //             }
    //         }

    //         if (!o.length) return []
    //         else return o
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    /** return excel item by {product_id}  */
    // async excelItemByProdID(id: string, product_id: string): Promise<ExcelModel> {
    //     try {
    //         if (!product_id || !id) throw new Error(`excelItemByProdID {product_id}, or {id} not set`)
    //         // call initialy if for the first time
    //         await this.excelStations()
    //         let o // << output
    //         const found = (prod_id, item) => (item.products || []).filter((n) => n.product_id === prod_id).length

    //         for (const item of this.staticExcelStations) {
    //             if (item.id === id) {
    //                 if (found(product_id, item)) {
    //                     o = item
    //                 }
    //                 break
    //             }
    //         }
    //         return o
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    /** return excel item by {id}  */
    async excelItem(id: string): Promise<ExcelModel> {
        try {
            if (!id) throw new Error(`excelItem {id} not set`)
            // call initialy if for the first time
            await this.excelStations()
            let o // << output
            for (const item of this.staticExcelStations) {
                if (item.id === id) {
                    o = item
                    break
                }
            }
            if (!o) throw new Error(`Item with id:${id} not found`)
            else return o
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     *   Add new excel item to staticExcelStations, all fields are required except for: {created_at,updated_at,id}
     * - Do not allow creating if same latitude/longitude already exist
     * - Do not allow creating if same address/city already exist
     */
    async createExcel(data: ExcelModel): Promise<ExcelModel> {
        try {
            // call initialy if for the first time
            await this.excelStations()
            if (!excelItem(data)) throw new Error('createExcel, invalid {data} provided')
            else {
                // check if some details alrady exist
                let exists = false
                for (const item of this.staticExcelStations) {
                    if (item.latitude === data.latitude && data.longitude === item.longitude) {
                        exists = true
                        break
                    }

                    const addressA = (item.address + item.city).toLowerCase()
                    const addressB = (data.address + data.city).toLowerCase()
                    if (matched(addressA, new RegExp(addressB, 'gi'))) {
                        exists = true
                        break
                    }
                }

                if (exists) {
                    throw new Error('Item already exists, check your {address,latitude,longitude} properties')
                }

                const nData: ExcelModel = {
                    ...data,
                    id: uid(),
                    created_at: new Date(),
                    updated_at: new Date(),
                }
                this.staticExcelStations.push(nData)
                this.staticExcelStations = this.userStaticExcelStations[this.userName]

                return this.staticExcelStations[this.staticExcelStations.length - 1]
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /** search item in staticExcelStations, make update, and only return that item*/
    // async updateExcel(id: string, data: ExcelUpdate[]): Promise<ExcelModel> {

    //     // 

    //     try {
    //         await this.excelStations()
    //         let updatedIndex: any

    //         let updateMulti = (d: ExcelUpdate) => {
    //             if (!namePriceProdID(d)) throw new Error('updateExcel, Invalid data')
    //             // call initialy if for the first time
    //             this.staticExcelStations.forEach((item, inx) => {
    //                 if (item.id === id) {
    //                     item.name = d.name
    //                     // find and update one product price
    //                     item.prices = (item.prices || []).map((x) => {
    //                         if (x.product_id === d.product_id) {
    //                             x.price = Number(d.price)
    //                         }
    //                         return x
    //                     })

    //                     updatedIndex = inx
    //                     item.updated_at = new Date()
    //                 }
    //             })
    //         }
  
    //         data.forEach((d) => {
    //             updateMulti(d)
    //         })

    //         if (this.staticExcelStations[updatedIndex]) {
    //             this.staticExcelStations = this.userStaticExcelStations[this.userName]
    //             return this.staticExcelStations[updatedIndex]
    //         } else {
    //             throw new Error(`Did not update, id:${id} not found`)
    //         }
    //     } catch (err) {
    //         return Promise.reject(err)
    //     }
    // }

    async updateExcelV2(id: string, data: ExcelModel): Promise<ExcelModel> {
        

        try {
            await this.excelStations()
            if (!excelItemUpdate(data)) throw new Error('updateExcel, Invalid data')

            const {name,prices} = data
            let updatedIndex: any
            this.staticExcelStations.forEach((item, inx) => {
                if(item.id===id){
                    item.prices = prices
                    item.name =name
                    updatedIndex = inx
                }
            })

            if (this.staticExcelStations[updatedIndex]) {
                this.staticExcelStations = this.userStaticExcelStations[this.userName]
                return this.staticExcelStations[updatedIndex]
            } else {
                throw new Error(`Did not update, id:${id} not found`)
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }


    /** delete any number of items from staticExcelStations by ids[]  */
    async deleteExcel(ids: Array<string | number>): Promise<Array<string>> {
        try {
            if (!(ids || []).length) throw new Error('deleteExcel, no ids provided')

            ids = [].concat(ids as any)
            ids = ids.filter((n) => !!n)
            // call initialy if for the first time
            await this.excelStations()
            const deletedItems: any[] = [] // list of deleted items by id

            for (const id of ids) {
                // we should always have one/uniq id. but because of static db, we check for all anyway
                const inxs: Array<number> = this.staticExcelStations.map((x, index) => (x.id === id ? index : undefined)).filter((x) => x !== undefined) as any

                let deleted = 0
                inxs.forEach((dbIndex) => {
                    this.staticExcelStations.splice(dbIndex, 1)
                    deleted++
                })
                if (deleted) {
                    deletedItems.push(id)
                    this.staticExcelStations = this.userStaticExcelStations[this.userName]
                }
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
 * to createExcel must provide dummy data
 *
 * */
// const staticDB = new StaticDB()
// staticDB.excelItem('61335ac2faf7da2be5d966db').then(console.log).catch(console.error)
// staticDB.excelItemByProdID('61335ac2faf7da2be5d966db', 'DIESEL').then(console.log).catch(console.error)
// staticDB.excelStationsByProdID(['DIESEL', 'BENZIN']).then(console.log).catch(console.error)
// staticDB.updateExcel('61335ac2faf7da2be5d966db', [{name: 'Migrol Tankstelle (alt)', price: 0, product_id: 'DIESEL'}]).then(console.log).catch(console.error)
// staticDB.deleteExcel(['61335ac2faf7da2be5d966db','61335ac2faf7da2be5a0dad3']).then(console.log).catch(console.error)
// staticDB.createExcel(dummydata).then(console.log).catch(console.error)
// staticDB.excelStations().then(console.log).catch(console.error)
