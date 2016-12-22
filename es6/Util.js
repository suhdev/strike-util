"use strict";
export function repeat(str, count) {
    let r = [];
    let i = 0;
    for (; i < count; i++) {
        r.push(str);
    }
    return r.join("");
}
export function identity(v) {
    return v;
}
/**
 * Extracts the names of the parameters from functions
 *
 * @export
 * @param {Function} fn the function to extract its parameters' names.
 * @returns {Array<string>} array of parameters names
 */
export function extractArgumentsFromFunction(fn) {
    let deps;
    fn.toString()
        .replace(/^function[\s]+?[\S]+?\((.*?)\)/, function (e, v, k) {
        deps = (v.trim().length > 0 && v.trim().split(/[\s,]+/)) || [];
        return e;
    });
    return deps;
}
/**
 * Returns value at a given key with in an object literal.
 *
 * @export
 * @param {*} object the object to use
 * @param {string} path the path to return its value
 * @param {string} p path separator, defaults to '.'
 * @returns {*} the value at the given key
 */
export function getDataAt(object, path, p) {
    let o = object, key, temp, pathSep = p ? p : '.', list = path.split(pathSep);
    while ((key = list.shift()) && (temp = o[key]) && (o = temp))
        ;
    return temp;
}
/**
 * (description)
 *
 * @export
 * @param {*} object (description)
 * @param {string} path (description)
 * @param {*} value (description)
 * @param {string} p (description)
 * @returns {*} (description)
 */
export function setDataAt(object, path, value, p) {
    let o = object, key, temp, pathSep = p ? p : '.', list = path.split(pathSep), lastKey = list.length > 0 ? list.splice(list.length - 1, 1)[0] : null;
    while ((key = list.shift()) && ((temp = o[key]) || (temp = o[key] = {})) && (o = temp))
        ;
    temp[lastKey] = value;
}
/**
 * (description)
 *
 * @export
 * @param {string} value (description)
 * @param {*} replacements (description)
 * @returns {string} (description)
 */
export function format(value, replacements) {
    if (!replacements) {
        return value;
    }
    return value.replace(/\{(.*?)\}/g, function (k, e) {
        return (replacements && replacements[e]) || k;
    });
}
/**
 *
 */
const FORMATTERS = {
    "typeof": (item) => {
        return typeof item;
    },
    "d": (item, extra) => {
        if (extra && extra.charAt(0) === ".") {
            return item.toFixed(+extra.substr(1));
        }
        else if (/^[0-9]+$/.test(extra)) {
            let len = parseInt(extra);
            let v = item + "";
            if (v.length < len) {
                return repeat("0", len - v.length) + v;
            }
            return v;
        }
        else if (/^[0-9]+\.[0-9]+$/.test(extra)) {
            let len = parseFloat(extra);
            let v = +(((len - Math.floor(len)) + "").substr(2));
            let k = parseInt(item);
            let t = item.toFixed(v);
        }
        return item;
    },
    "x": (item) => {
        return item.toString(16);
    },
    "o": (item) => {
        if (typeof item === "object") {
            if (item.toJSON) {
                return JSON.stringify(item.toJSON());
            }
            return item.toString();
        }
        return item;
    },
    "s": (item) => {
        return item;
    }
};
/**
 *
 *
 * @export
 * @returns
 */
export function createFormatter() {
    let formats = ['[0-9]+?\.[0-9]+?d', '[0-9]+?d', '\.[0-9]+?d', 'd', 'x', 's', 'o', 'typeof'];
    let customFormats = {};
    function fmt(format, ...args) {
        let regex = new RegExp("%(" + formats.join("|") + ")");
        let final = args.reduce((prev, current, cIdx) => {
            return prev.replace(regex, (all, a) => {
                let len = a.length, f = a.charAt(len - 1), fn = FORMATTERS[a] || customFormats[a];
                if (fn) {
                    return fn(current, '');
                }
                fn = FORMATTERS[f] || customFormats[f];
                if (fn) {
                    return fn(current, a.substr(0, len - 1));
                }
            });
        }, format);
        return final;
    }
    return {
        addFormat(f, fn) {
            customFormats[f] = fn;
            formats.push(f);
        },
        addFormatFirst(f, fn) {
            customFormats[f] = fn;
            formats.unshift(f);
        },
        format: fmt
    };
}
/**
 *
 *
 * @export
 * @param {string} format
 * @param {...any[]} args
 * @returns
 */
export function printf(format, ...args) {
    let final = args.reduce((prev, current, cIdx) => {
        return prev.replace(/%([0-9]+?\.[0-9]+?d|[0-9]+?d|\.[0-9]+?d|d|x|s|o|typeof)/, (all, a) => {
            let len = a.length, f = a.charAt(len - 1);
            return (FORMATTERS[a] && FORMATTERS[a](current)) || (FORMATTERS[f] && FORMATTERS[f](current, a.substr(0, len - 1)));
        });
    }, format);
    return final;
}
