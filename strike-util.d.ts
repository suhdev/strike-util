declare module 'strike-util'{
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

    export function curry<T>(params:any[],fn:(...args:any[])=>T):(...args:any[])=>T;

    /**
     * Repeats a given string specific number of times. 
     * @export
     * @param {string} str the string to repeat 
     * @param {number} count the number of repitions. 
     * @returns the repeated string 
     */
    export function repeat(str:string,count:number):string;

    /**
     * A function that retuns its first parameter. 
     */
    export function identity<T>(v:T):T;

    /**
     * Extracts the names of the parameters from functions
     * 
     * @export
     * @param {Function} fn the function to extract its parameters' names.
     * @returns {Array<string>} array of parameters names  
     */
    export function extractArgumentsFromFunction(fn: Function): string[];

    /**
     * Returns value at a given key with in an object literal. 
     * 
     * @export
     * @param {*} object the object to use 
     * @param {string} path the path to return its value 
     * @param {string} p path separator, defaults to '.'
     * @returns {*} the value at the given key 
     */
    export function getDataAt<T>(object: any, path: string, p: string): T; 

    /**
     * Set a value within an object at a given key path 
     * 
     * @export
     * @param {*} object (description)
     * @param {string} path (description)
     * @param {*} value (description)
     * @param {string} p (description)
     * @returns {*} (description)
     */
    export function setDataAt(object: any, path: string, value: any, p: string): void;

    /**
     * Formats a string with placeholder. 
     * 
     * @export
     * @param {string} value (description)
     * @param {*} replacements (description)
     * @returns {string} (description)
     */
    export function format(value: string, replacements: string[]): string;

    export interface Formatter {
        addFormat(f:string,fn:any):Formatter;
        addFormatFirst(f:string,fn:any):Formatter;
        format(format:string,...args:any[]):string; 
    }
    
    /**
     * Creates a customizable string formatter. 
     * 
     * @export
     * @returns
     */
    export function createFormatter():Formatter;

    /**
     * A JavaScript implementation of C printf. 
     * 
     * @export
     * @param {string} format
     * @param {...any[]} args
     * @returns
     */
    export function printf(format:string,...args:any[]):string;

}