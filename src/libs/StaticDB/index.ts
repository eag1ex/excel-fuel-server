
/**
 * @description Our static database, is loaded from file and storing new changes to local variable in active session
 * - Each session can be assigned to different user
 */

import { ExcelModel, ExcelProduct } from '@api/interfaces'
import {excelItem, uid, excelItemUpdate } from '../../utils'
import { copy, log, matched, onerror } from 'x-utils-es/umd'
import config from '../../config'
import messages from '../../messages';

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


    /**
     *   Add new excel item to staticExcelStations, all fields are required except for: {created_at,updated_at,id}
     * - Do not allow creating if same latitude/longitude already exist
     * - Do not allow creating if same address/city already exist
     */
    async createExcel(data: ExcelModel): Promise<ExcelModel> {
        try {
            // call initialy if for the first time
            await this.excelStations()
            if (!excelItem(data)) throw new Error(messages['005'].message)
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

