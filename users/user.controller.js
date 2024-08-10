const User = require('../models/User')
const jwt = require('jsonwebtoken');

require('dotenv').config()

const CreateUser = async (req, res) => {
    try {
        const userFromRequest = req.body

        const existingUser = await User.findOne({
            email: userFromRequest.email
        });
    
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists',
            })
        }
    
        const user = await User.create({
            first_name: userFromRequest.first_name,
            last_name: userFromRequest.last_name,
            email: userFromRequest.email,
            password: userFromRequest.password
        });
    
        const token = await jwt.sign({ email: user.email, _id: user._id}, process.env.JWT_SECRET)
    
        return res.status(201).redirect('/login')
        
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            data: null
        })
    }

}

const Login = async (req, res) => {
    try {
        console.log('[CreateUser] => login process started')
        const userFromRequest = req.body
    
        const user = await User.findOne({
            email: userFromRequest.email,
        });
    
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            }) 
        }
    
        const validPassword = await user.isValidPassword(userFromRequest.password)
    
        if (!validPassword) {
            return res.status(422).json({
                message: 'Email or password is not correct',
            }) 
        }
    
        const token = await jwt.sign({ email: user.email, _id: user._id}, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' })
    
        console.log('[CreateUser] => login process done')

        // Store user in session
        req.session.user = user;
        req.session.token = token;
        
        // Return JSON response with redirect URL
        return res.status(200).redirect('/dashboard')
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'Server Error',
            data: null
        })
    }
}

module.exports = {
    CreateUser,
    Login
}