const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const {users} = require('../db.js')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')


router.post('/signup', [
    check('email', 'please provide a valid email').isEmail(),
    check('password', 'password should be 6 chars min').isLength({ min: 6 })
], async (req, res) => {
    const { email, password } = req.body
    //Validated Input
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //Validated if user doesn't already exist
    let user = users.find(user => user.email === email)

    if(user) {
        return res.status(400).json({
            'errors': [
                {'msg': 'this user already exists'}
            ]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({
        email,
        password: hashedPassword
    })

    const token = JWT.sign({ email }, 'secretkey', {
        expiresIn: 30000
    })
    res.json({ token })
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body
    let user = users.find(user => user.email === email)
    if (!user) {
        return res.status(400).json({
            'errors': [
                { 'msg': 'This email is not Signed Up'}
            ]
        })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({
            'errors': [
                { 'msg': 'Invalid Credentials'}
            ]
        })
    }
    const token = await JWT.sign({ email }, 'secretkey', {
        expiresIn: 30000
    })
    res.json({ token })
})


//Get Route
router.get('/', (req, res) => {
    res.json(users)
})











module.exports = router