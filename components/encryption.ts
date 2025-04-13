const rawKey = process.env.SECRET_HASH_KEY
// const rawKey = "1234567890abcdef" // EXACTLY 16 chars

const secretKey = new TextEncoder().encode(rawKey)

if (![16, 32].includes(secretKey.length)) {
  throw new Error("AES key must be 16 or 32 bytes long")
}
async function getKey() {
  return await crypto.subtle.importKey(
    "raw",
    secretKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  )
}

export async function encryptValue(value: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await getKey()
  const encoded = new TextEncoder().encode(value)
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  )

  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv)
  result.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...result)) // base64-encoded
}

export async function decryptValue(encoded: string): Promise<string> {
  const data = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
  const iv = data.slice(0, 12)
  const encrypted = data.slice(12)
  const key = await getKey()
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  )
  return new TextDecoder().decode(decrypted)
}
