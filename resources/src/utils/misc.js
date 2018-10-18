
import dateUtils from "element-ui/lib/utils/date"
import findIndex from "lodash.findindex"
import getObjectByPath from 'lodash.get'

export default {

    isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]"
    },

    isEmpty(obj) {
        return obj === null || (this.isArray(obj) && obj.length == 0 ) || typeof(obj) !== 'object'  || Object.keys(obj).length === 0
    },

    findIndex(array, callback){
        return findIndex(array, callback)
    },

    formatDate(date, format = 'yyyy-MM-dd HH:mm:ss'){
        return dateUtils.format(date, format)
    },

    parseDate(str, format = 'yyyy-MM-dd HH:mm:ss'){
        return dateUtils.parse(str, format);
    },

    trim(str) {
        return `${str}`.replace(/^\s*|\s*$/g, '')
    },

    transformDictTypes(context, key) {
        const array = context && context[key]
        if(!this.isArray(array)) return
        const obj = {}
        array.forEach(item => {
            obj[item.value] = item.label
        })
        return obj

    },

    transformDictTypes2(context, key) {
        const array = context && context[key]
        if(!this.isArray(array)) return
        const obj = {}
        array.forEach(item => {
            obj[item.label] = item.value
        })
        return obj

    },

    uuid() {
        const uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random()*16|0
            const v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
		return uuid.replace(/-/g,"");
    },

    getObject(context, path, defaultValue) {
        return getObjectByPath(context, path, defaultValue)
    }

}
