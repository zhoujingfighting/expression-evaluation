const alphaReg = /[a-zA-Z]/;
const digitReg = /[0-9]/;

export function isAlpha(CurChar:string): boolean {
    return CurChar !== undefined && alphaReg.test(CurChar);
}

export function isDigit(CurChar:string): boolean {
    return CurChar !== undefined && digitReg.test(CurChar);
}

export interface FuncCallInfo {
    name: string;
    args:string[];
}