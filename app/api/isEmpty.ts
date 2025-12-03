export function isEmpty(values: string[]) {
    for (let i = 0;i<values.length;i++) {
        if (values[i].trim() == "") {
            return true
        }
    }
    return false
}