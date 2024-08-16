const joi = require('joi')

const boardCreationValidator = async (req, res, next) => {
    try {
        const bodyOfRequest = req.body
        const schema = joi.object({
            name: joi.string().required(),
            organization: joi.string().pattern(/^[0-9a-fA-F]{24}$/),
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

module.exports = boardCreationValidator