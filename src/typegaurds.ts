
export function isWord(i: any): i is Word {
    return typeof i === "string"
}

export function isLookupObject(i: any): i is LookupObject {
    return false // TODO implement
}
