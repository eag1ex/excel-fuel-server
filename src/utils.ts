import { reduce } from 'lodash'
import { onerror, sq } from 'x-utils-es/umd'
import config from './config'
import { ENV, Message } from '@api/interfaces'

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