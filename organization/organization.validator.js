const joi = require('joi')

const organizationCreationValidator = async (req, res, next) => {
    try {
        const bodyOfRequest = req.body
        const schema = joi.object({
            owner: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
            title: joi.string().max(20).min(3).required(),
            board: joi.number().required().default(1),
            createdAt: joi.date().default(Date.now),
            updatedAt: joi.date().default(Date.now)
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

module.exports = organizationCreationValidator