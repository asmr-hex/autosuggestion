

export const NormalizePattern: (words: string | (string | Lookup)[]) => (string | Lookup)[] = words => {
    if (typeof words === "string") return [words]
    return words
}
