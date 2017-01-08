"use strict";
/**
 * An interface representing an object literal 
 * 
 * @export
 * @interface Dictionary
 * @template V
 */
export interface Dictionary<V>{
    [arg:string]:V
}

export function repeat(str:string,count:number):string{
    let r = []; 
    let i =0;
    for(;i<count;i++){
        r.push(str); 
    }
    return r.join("");
}

export function identity(v:any){
    return v;
}

/**
 * Extracts the names of the parameters from functions
 * 
 * @export
 * @param {Function} fn the function to extract its parameters' names.
 * @returns {Array<string>} array of parameters names  
 */
export function extractArgumentsFromFunction(fn: Function): any {
    let deps: any;
    fn.toString()
        .replace(/^function[\s]+?[\S]+?\((.*?)\)/, function(e: string, v: string, k: number) {
            deps = (v.trim().length > 0 && v.trim().split(/[\s,]+/)) || [];
            return e;
        })
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
export function getDataAt(object: any, path: string, p: string): any {
    let o: any = object,
        key: string,
        temp: any,
        pathSep: string = p ? p : '.',
        list: string[] = path.split(pathSep);
    while ((key = list.shift()) && (temp = o[key]) && (o = temp));
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
export function setDataAt(object: any, path: string, value: any, p: string): any {
    let o: any = object,
        key: string,
        temp: any,
        pathSep: string = p ? p : '.',
        list: string[] = path.split(pathSep),
        lastKey: string = list.length > 0 ? list.splice(list.length - 1, 1)[0] : null;
    while ((key = list.shift()) && ((temp = o[key]) || (temp = o[key] = {})) && (o = temp));
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
export function format(value: string, replacements: any): string {
    if (!replacements) {
        return value;
    }
    return value.replace(/\{(.*?)\}/g, function(k, e) {
        return (replacements && replacements[e]) || k;
    });
}

export function curry<T>(params:any[],fn:(...args:any[])=>T):(...args:any[])=>T{
    let vv = params;  
    return function(){
        let kk = Array.prototype.slice.call(arguments,0); 
        return fn.apply(null,[].concat(vv,kk)); 
    }
}

/**
 * 
 */
const FORMATTERS = {
    "typeof":(item:any):string=>{
        return typeof item; 
    },
    "skip":(item:any):string=>{
        return "";
    },
    "d":(item:number|any,extra?:string):string=>{
        if (extra && extra.charAt(0)=== "."){
            return item.toFixed(+extra.substr(1));
        }else if (/^[0-9]+$/.test(extra)){
            let len = parseInt(extra); 
            let v = item+"";
            if (v.length < len){
                return repeat("0",len-v.length)+v; 
            }
            return v; 
        }else if (/^[0-9]+\.[0-9]+$/.test(extra)){
            let kk = extra.split('.').map(v=>parseInt(v)); 
            let ik = kk[0]; 
            let fk = kk[1]; 
            let v = parseInt(item)+"";
            if (v.length < ik){
                v = repeat("0",ik-v.length)+v;
            }
            let ff = parseFloat(item) - parseInt(item); 
            return (v+"")+ff.toFixed(fk).substr(1); 
        }
        return item; 
    },
    "x":(item:number|any):string=>{
        return "0x"+item.toString(16); 
    },
    "o":(item:any):string=>{
        if (typeof item === "object"){
            if (item.toJSON){
                return JSON.stringify(item.toJSON()); 
            }
            return item.toString(); 
        }
        return item; 
    },
    "s":(item:any):string=>{
        return item; 
    }
};
/**
 * 
 * 
 * @export
 * @returns
 */
export function createFormatter(){
    let formats = ['[0-9]+?\.[0-9]+?d','[0-9]+?d','\.[0-9]+?d','d','x','s','o','typeof','skip']; 
    let customFormats = {};  
    function fmt(format:string,...args:any[]):string{
        let regex = new RegExp("%("+formats.join("|")+")"); 
        let final = args.reduce<string>((prev,current,cIdx)=>{
            return prev.replace(regex,(all:string,a:string)=>{ 
                let len = a.length,
                    f = a.charAt(len-1),
                    fn:any = FORMATTERS[a] || customFormats[a];
                if (fn){
                    return fn(current,''); 
                }
                fn = FORMATTERS[f] || customFormats[f]; 
                if (fn){
                    return fn(current,a.substr(0,len-1))
                }
            }); 
        },format);
        return final;
    } 
    return {
        addFormat(f:string,fn:any){
            customFormats[f] = fn;
            formats.push(f);
        },
        addFormatFirst(f:string,fn:any){
            customFormats[f] = fn;
            formats.unshift(f);
        },
        format:fmt
    }
}

/**
 * 
 * 
 * @export
 * @param {string} format
 * @param {...any[]} args
 * @returns
 */
export function printf(format:string,...args:any[]){
    let final = args.reduce<string>((prev,current,cIdx)=>{
        return prev.replace(/%([0-9]+?\.[0-9]+?d|[0-9]+?d|\.[0-9]+?d|d|x|s|o|typeof|skip)/,(all:string,a:string)=>{
            let len = a.length,
                f = a.charAt(len-1);
        return (FORMATTERS[a] && FORMATTERS[a](current))||(FORMATTERS[f] && FORMATTERS[f](current,a.substr(0,len-1))); 
        }); 
    },format); 
    return final;
}
