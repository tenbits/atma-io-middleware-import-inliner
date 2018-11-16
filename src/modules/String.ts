export namespace String {
    export function replace (str: string, i: number, length: number, ins: string = '') {
        return str.substring(0, i) + ins + str.substring(i + length);
    }
}