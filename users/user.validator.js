const joi = require('joi')

const validateUserCreationJoi = async  (req, res, next) => {
    try {
        const bodyOfRequest = req.body
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9@#]{3,30}$')).required(),
            created_at: joi.date().default(Date.now),
            updated_at: joi.date().default(Date.now)
        })
        await schema.validateAsync(bodyOfRequest, { abortEarly: true })
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

const LoginValidation = async (req, res, next) => {
    try {
        const schema = joi.object({
            password: joi.string().required(),
            email: joi.string().email().required(),
        })

        await schema.validateAsync(req.body, { abortEarly: true })
    
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

module.exports = { validateUserCreationJoi, LoginValidation }