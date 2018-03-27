

const camel_case_reg = /[a-z0-9]+|[A-Z]+[a-z0-9]+/g;

/**
 * 将下划线命名的对象复制为驼峰式的对象
 * @param obj 
 */
export function copyFromUnderline(obj: { [k: string]: any }) {
    let keys: string[] = obj.keys ? obj.keys() : Object.keys(obj);
    let target: any = {};
    for (let key of keys) {
        let name: string;
        if (key.indexOf('_') > -1) {
            name = key.split('_').map((x, i) => {
                if (i === 0) {
                    return x;
                }
                return x[0].toUpperCase() + x.substr(1);
            }).join('');
        } else {
            name = key;
        }
        target[name] = obj[key];
    }
    return target;
}

/**
 * 复制为下划线命名的对象
 * @param obj 
 */
export function copyToUnderline(obj: { [k: string]: any }) {
    let keys = Object.keys(obj);
    let target: any = {};
    for (let key of keys) {
        let name = toUnderline(key);
        target[name] = obj[key];
    }
    return target;
}

export function toUnderline(camel: string) {
    return camel.match(camel_case_reg).join('_').toLowerCase();
}