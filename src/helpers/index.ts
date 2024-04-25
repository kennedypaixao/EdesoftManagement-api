import crypto from 'crypto';

// Generate secret hash with crypto to use for encryption
const key = () => crypto
    .createHash('sha512')
    .update(process.env.SECRET_KEY)
    .digest('hex')
    .substring(0, 32)
const encryptionIV = () => crypto
    .createHash('sha512')
    .update(process.env.SECRET_IV)
    .digest('hex')
    .substring(0, 16)

const SECRET = 'EDESOFT-MANAGEMENT-API';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (password: string) => {
    return crypto.createHmac('sha256', password).update(SECRET).digest('hex');
}
export const Encrypt = (text: string): string => {
    const cipher = crypto.createCipheriv(process.env.ECNRYPTION_METHOD, key(), encryptionIV())
    return Buffer.from(
        cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
}
export const Decrypt = (text: string): string => {
    const buff = Buffer.from(text, 'base64')
    const decipher = crypto.createDecipheriv(process.env.ECNRYPTION_METHOD, key(), encryptionIV())
    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    );
}