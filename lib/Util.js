"use strict";
function repeat(str, count) {
    var r = [];
    var i = 0;
    for (; i < count; i++) {
        r.push(str);
    }
    return r.join("");
}
exports.repeat = repeat;
function identity(v) {
    return v;
}
exports.identity = identity;
/**
 * Extracts the names of the parameters from functions
 *
 * @export
 * @param {Function} fn the function to extract its parameters' names.
 * @returns {Array<string>} array of parameters names
 */
function extractArgumentsFromFunction(fn) {
    var deps;
    fn.toString()
        .replace(/^function[\s]+?[\S]+?\((.*?)\)/, function (e, v, k) {
        deps = (v.trim().length > 0 && v.trim().split(/[\s,]+/)) || [];
        return e;
    });
    return deps;
}
exports.extractArgumentsFromFunction = extractArgumentsFromFunction;
/**
 * Returns value at a given key with in an object literal.
 *
 * @export
 * @param {*} object the object to use
 * @param {string} path the path to return its value
 * @param {string} p path separator, defaults to '.'
 * @returns {*} the value at the given key
 */
function getDataAt(object, path, p) {
    var o = object, key, temp, pathSep = p ? p : '.', list = path.split(pathSep);
    while ((key = list.shift()) && (temp = o[key]) && (o = temp))
        ;
    return temp;
}
exports.getDataAt = getDataAt;
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
function setDataAt(object, path, value, p) {
    var o = object, key, temp, pathSep = p ? p : '.', list = path.split(pathSep), lastKey = list.length > 0 ? list.splice(list.length - 1, 1)[0] : null;
    while ((key = list.shift()) && ((temp = o[key]) || (temp = o[key] = {})) && (o = temp))
        ;
    temp[lastKey] = value;
}
exports.setDataAt = setDataAt;
/**
 * (description)
 *
 * @export
 * @param {string} value (description)
 * @param {*} replacements (description)
 * @returns {string} (description)
 */
function format(value, replacements) {
    if (!replacements) {
        return value;
    }
    return value.replace(/\{(.*?)\}/g, function (k, e) {
        return (replacements && replacements[e]) || k;
    });
}
exports.format = format;
function curry(params, fn) {
    var vv = params;
    return function () {
        var kk = Array.prototype.slice.call(arguments, 0);
        return fn.apply(null, [].concat(vv, kk));
    };
}
exports.curry = curry;
/**
 *
 */
var FORMATTERS = {
    "typeof": function (item) {
        return typeof item;
    },
    "d": function (item, extra) {
        if (extra && extra.charAt(0) === ".") {
            return item.toFixed(+extra.substr(1));
        }
        else if (/^[0-9]+$/.test(extra)) {
            var len = parseInt(extra);
            var v = item + "";
            if (v.length < len) {
                return repeat("0", len - v.length) + v;
            }
            return v;
        }
        else if (/^[0-9]+\.[0-9]+$/.test(extra)) {
            var kk = extra.split('.').map(function (v) { return parseInt(v); });
            var ik = kk[0];
            var fk = kk[1];
            var v = parseInt(item) + "";
            if (v.length < ik) {
                v = repeat("0", ik - v.length) + v;
            }
            var ff = parseFloat(item) - parseInt(item);
            return (v + "") + ff.toFixed(fk).substr(1);
        }
        return item;
    },
    "x": function (item) {
        return "0x" + item.toString(16);
    },
    "o": function (item) {
        if (typeof item === "object") {
            if (item.toJSON) {
                return JSON.stringify(item.toJSON());
            }
            return item.toString();
        }
        return item;
    },
    "s": function (item) {
        return item;
    }
};
/**
 *
 *
 * @export
 * @returns
 */
function createFormatter() {
    var formats = ['[0-9]+?\.[0-9]+?d', '[0-9]+?d', '\.[0-9]+?d', 'd', 'x', 's', 'o', 'typeof'];
    var customFormats = {};
    function fmt(format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var regex = new RegExp("%(" + formats.join("|") + ")");
        var final = args.reduce(function (prev, current, cIdx) {
            return prev.replace(regex, function (all, a) {
                var len = a.length, f = a.charAt(len - 1), fn = FORMATTERS[a] || customFormats[a];
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
        addFormat: function (f, fn) {
            customFormats[f] = fn;
            formats.push(f);
        },
        addFormatFirst: function (f, fn) {
            customFormats[f] = fn;
            formats.unshift(f);
        },
        format: fmt
    };
}
exports.createFormatter = createFormatter;
/**
 *
 *
 * @export
 * @param {string} format
 * @param {...any[]} args
 * @returns
 */
function printf(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var final = args.reduce(function (prev, current, cIdx) {
        return prev.replace(/%([0-9]+?\.[0-9]+?d|[0-9]+?d|\.[0-9]+?d|d|x|s|o|typeof)/, function (all, a) {
            var len = a.length, f = a.charAt(len - 1);
            return (FORMATTERS[a] && FORMATTERS[a](current)) || (FORMATTERS[f] && FORMATTERS[f](current, a.substr(0, len - 1)));
        });
    }, format);
    return final;
}
exports.printf = printf;
