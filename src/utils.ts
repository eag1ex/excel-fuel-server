import { reduce } from 'lodash'
import { isArray, isNull, isNumber, objectSize, onerror, sq, truthFul } from 'x-utils-es/umd'
import config from './config'
import { ENV, Message, PetrolModel, PetrolUpdate } from '@api/interfaces'
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

/** grap only  {name, price, product_id} */
export const namePriceProdID = ({ name, price, product_id }): PetrolUpdate | undefined => {
    const d = { name, price, product_id }

    if (objectSize(truthFul(d)) !== 3) {
        return undefined
    }

    if (isNull(Number(price))){
        return undefined
    }

    else return d
}


/**
 * Sheck input data, only return if all required props are provided
 */
export const petrolItem = (inputData: PetrolModel): PetrolModel => {
    const {name, address, city, latitude, longitude, prices, products} = inputData // 7 props

    if (objectSize(truthFul({name, address, city, latitude, longitude, prices, products})) !== 7){
        return undefined as any
    }
    if (!isArray(prices)) return undefined as any
    if (!isArray(products)) return undefined as any
    if (!isNumber(longitude) || !isNumber(latitude)) return undefined as any

    else return inputData
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
        if (parted.length === 2) return parted[1]
        else return null
    }
    return null
}

export const JWTverifyAccess = (jwt: any, req: any, token: any): Promise<any> => {
    const defer = sq()
    if (!token) return Promise.reject('NO_TOKEN')
    else {
        jwt.verify(token, config.secret, function(err: any, decoded: any) {
            if (err) {
                onerror('[JWTverifyAccess]', err.toString())
                defer.reject('NOT_AUTHENTICATED')
            } else {
                req.token = decoded // [1]
                defer.resolve(true)
            }
        })
    }
    return defer
}

export const env = (): ENV => {
    return process.env.NODE_ENV as any
}
