import jwt from "jsonwebtoken"

export const JWT_PRIVATE_KEY = "SuperSecretKey"

export const generateToken = (payload => {
    const token = jwt.sign(payload, JWT_PRIVATE_KEY, {expiresIn:"5m"})
    return token
})


export const verifyToken = (token) => {

    try {
        const decoded = jwt.verify(token,JWT_PRIVATE_KEY)
        return decoded
    } catch (error) {
        throw new Error(`Invalid token: ${error}`)
    }

}