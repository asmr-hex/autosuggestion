
export function isWord(i: any): i is Word {
    return typeof i === "string"
}

export function isLookup(i: any): i is Lookup {
    return (!!i) && (i.constructor === Object)
}
