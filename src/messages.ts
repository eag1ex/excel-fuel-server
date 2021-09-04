
import { Message } from '@api/interfaces';
import { onMessages } from './utils'
const messages = {
    _msg: {},

    /**
     * - errors and messages
     * returns example :message[500]=> `{message,code}`
     */
    set msg(v) {
        this._msg = v
    },
    get msg() {
        return this._msg
    }
}
messages.msg = onMessages({
    500: ['Server error', '500'],
    '001': ['Route no available', '001'],
    '002': ['Issue with petrol list', '002']
})

export default messages.msg as Message
