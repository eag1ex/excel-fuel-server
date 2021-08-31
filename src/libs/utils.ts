/**
 * @typedef {import("../types").types.IMessage} IMessage
 */

import { reduce } from 'lodash'
import { onerror, log } from 'x-utils-es/umd'
import q from 'q'
import config from '../../config'

export const listRoutes = (stack: any, appNameRoute: any) => {

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

/** check if mongo _id is valid format*/
export const validID = (id: string) => {
    try {
        const rgx = new RegExp('^[0-9a-fA-F]{24}$')
        return rgx.test(id)
    } catch (err) {
        return false
    }
}

export const validStatus = (status = '') => ['pending', 'completed'].indexOf(status || '') !== -1

/**
 * - accepting object of messages, example: `{'001':['SimpleOrder listStore is empty',001],...}`
 * - returns : {'001':{message,code},...}
 * @returns {IMessage}
 */
export const onMessages = (messages: any) => {
    /** @type {IMessage} */
    const msgs = {} as any

    for (const [k, v] of Object.entries(messages) as any) {
        msgs[k] = { message: v[0], code: v[1] }
    }
    return msgs
}

/**
 * Grab tokep from headers
 * @param {*} headers {}
 */
export const getToken = (headers: any = {}) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ')
        if (parted.length === 2) return parted[1]
        else return null
    }
    return null
}

export const JWTverifyAccess = (jwt: any, req: any, token: any) => {
    const defer = q.defer()
    if (!token) {
        return Promise.reject('NO_TOKEN')
    } else {
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

    return defer.promise
}

/**
 * check allowed url routes to skipp authentication
 */
export const validate = (url: string, allowed: Array<string>) => {
    const validate =
        allowed.filter((val) => {
            if (url === val && val === '/') return true
            // for base route
            else if (val !== '/') return url.indexOf(val) !== -1
        }).length >= 1
    return validate
}
