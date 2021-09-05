
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
    '002': ['Problem with excel list', '002'],
    '003': ['Create, no data provided', '003'], // createExcel
    '004': ['Problem creating new item', '004'], // createExcel
    // '005' << used
    '006': ['No data provided to update', '006'], // updateExcel
    '007': ['Problem updating new item', '007'],  // updateExcel
    '008': ['Problem deteting item', '008'], // deleteExcel
    '009': ['Problem finding item', '009'] // exelItem
})

export default messages.msg as Message
