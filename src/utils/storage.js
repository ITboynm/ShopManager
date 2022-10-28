/** 
*Storage二次封装
* @author ZW
*/
import config from "../config";
class SetStorage {
    constructor(namespace) {
        this.namespace = namespace
    }
    setItem(key, val) {
        const storage = this.#getStorage()
        // 写入新值
        storage[key] = val
        this.#setStorage(storage)
    }
    getItem(key) {
        return (this.#getStorage())[key]
    }
    clearItem(key) {
        let storage = this.#getStorage()
        delete storage[key]
        this.#setStorage(storage)
    }
    clearAll() {
        window.localStorage.clear()
    }
    #getStorage() {
        // 先取值
        let storage = window.localStorage.getItem(this.namespace) || "{}"
        return JSON.parse(storage)
    }
    #setStorage(val) {
        window.localStorage.setItem(this.namespace, JSON.stringify(val))
    }
}
const storage = new SetStorage(config.namespace)
export { storage, SetStorage }