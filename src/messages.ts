
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
    '002': ['Problem with petrol list', '002'],
    '003': ['Create, no data provided', '003'], // createPetrol
    '004': ['Problem creating new item', '004'], // createPetrol
    // '005' << used
    '006': ['No data provided to update', '006'], // updatePetrol
    '007': ['Problem updating new item', '007'],  // updatePetrol
    '008': ['Problem deteting item', '008'], // deletePetrol
    '009': ['Problem finding item', '009'] // petrolItem
})

export default messages.msg as Message
