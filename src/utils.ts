import { reduce } from 'lodash'
import {  isString,   onerror, sq, isFalsy, log } from 'x-utils-es/umd';
import config from './config'
import { ENV, Message, ExcelModel, ExcelPrice, ExcelProduct } from '@api/interfaces'
import ObjectId from 'mongo-objectid'

export const listRoutes = (stack: any, appNameRoute: any): Array<{ route: string }> => {
    return reduce(
        stack,
        (n: any, el, k) => {
            if (el.route) {
                if (((el.route || {}).path || '').indexOf('/') !== -1) {
                    n.push({ route: appNameRoute ? `${appNameRoute}${el.route.path}` : el.route.path })
                }
            }
            return n
        },
        []
    )
}

/** generate uniq mongo id */
export const uid = () => {
    return new ObjectId().toString()
}


/**
 * check valid latitude and longitude
 */
export const validLatLng = (lat: number | string, lng: number | string) => {

    const isLatitude = num => isFinite(Number(num)) && Math.abs(Number(num)) <= 90;
    const isLongitude = num => isFinite(Number(num)) && Math.abs(Number(num)) <= 180;
    return isLatitude(lat) && isLongitude(lng)
}


export const hasSpecialChar = (str) => {
    try{
        return  /[\[\]\\,()?!%$@#~{}=^*_'"<>]/g.test(str)
    }catch (err){
        return true
    }

}

/** return valud price pair */
const validPricePair = (pricePair: ExcelPrice): ExcelPrice => {
    if ( isNaN(Number(pricePair.price)) || (pricePair as any).price === '') return undefined as any
    if (!pricePair.currency || !isString(pricePair.currency )) return undefined as any
    if (!pricePair.product_id || !isString(pricePair.product_id )) return undefined as any
    else return pricePair
}

export const validProductPair = (prodPair: ExcelProduct): ExcelProduct => {
    if (!prodPair) return undefined as any
    if (!prodPair.product_id) return undefined as any
    if (prodPair.points.filter((n) => n.id && n.status).length !== prodPair.points.length) return undefined as any
    else return prodPair
}


/**
 * Sheck input data, only return if all required props are provided
 */
export const excelItem = (inputData: ExcelModel): ExcelModel => {
    const { name, address, city, latitude, longitude, prices, products } = inputData // 7 props

    if ( [name, address, city, latitude, longitude].filter(n => !isFalsy(n)).length !== 5) {
        return undefined as any
    }

    const invalidMixed = [name, address, city].filter(n => hasSpecialChar(n)).length
     // products are optional, so only check if any are set
    const invalidProds = products.filter(n => !validProductPair(n)).length
    const invalidPrices = prices.filter(n => !validPricePair(n)).length

    if (invalidMixed) return undefined as any

    if ( invalidProds && products.length) return undefined as any
    if (invalidPrices || !(prices || []).length) return undefined as any
    if (!validLatLng(latitude, longitude)) return undefined as any

    return inputData
}

export const excelItemUpdate = (inputData: ExcelModel): ExcelModel => {

    const { name,  prices } = inputData // 2 props

    if (!name) return undefined as any
    if (hasSpecialChar(name))  return undefined as any
    const invalidPrices = prices.filter(n => !validPricePair(n)).length

     // prices are optional
    if ((prices || []).length){
        if (invalidPrices) return undefined as any
    }

    return inputData
}


/**
 *
 * - accepting object of messages, example: `{'001':['SimpleOrder listStore is empty',001],...}`
 * - returns : {'001':{message,code},...}
 */
export const onMessages = (messages: { [code: string]: [string, string] }) => {
    const msgs = {} as Message
    for (const [k, v] of Object.entries(messages) as any) {
        msgs[k] = { message: v[0], code: v[1] }
    }
    return msgs
}

/**
 * Grab tokep from headers
 */
export const getToken = (headers: any = {}) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ')
        // get after Bearer
        if (parted.length === 2) return parted[1]
        else return null
    }
    return null
}

export const JWTverifyAccess = (jwt: any, req: any, token: any): Promise<boolean | string> => {
    const defer = sq()
    if (!token) return Promise.reject('NO_TOKEN')
    else {
        jwt.verify(token, config.secret, function(err: any, decoded: any) {
            if (err) {
                onerror('[JWTverifyAccess]', err.toString())
                defer.reject(err)
            } else {
                req.token = decoded
                defer.resolve('SESSION_VALID')
            }
        })
    }
    return defer
}

export const validCreds = ({ username, password }): boolean => username === config.staticDB.username && password === config.staticDB.password

export const env = (): ENV => {
    // heroku setting
    if (process.env.EXCEL_APP === '1') return 'production'
    else return process.env.NODE_ENV as any
}
