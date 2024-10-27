import crypto from "crypto"

export function generateUUID() {
    const uuid = crypto.randomUUID()
    console.log(uuid)
    return uuid
}