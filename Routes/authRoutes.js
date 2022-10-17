const router = require('express').Router()
const User = require('../models/User')
const {registerSchema , loginSchema} = require("../utils/validator")
const {randomString} = require('../utils/randomString')
const {generateToken} = require('../utils/generateToken')
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcryptjs')
const {verifyTokenAndAuthorization} = require('../middlewares/verifyToken')

router.post('/register', async (req, res)=>{
    const value = registerSchema.validateAsync(req.body)
    console.log(value)
    const {email,name,password} = req.body
  /*  if(error.isJoi()){ 
        res.status(400).json({message: error})
    } */
    let user = await User.findOne({email:email})
    console.log(user)
     if(user){
      return  res.status(409).json({message:"Email already exists"})
    }
    let uniqueString = randomString();
    user = new User({
        username:name,
        email,
        password,
        uniqueString
    },)
    const url = `${process.env.BASE_URL}/auth/verify/${uniqueString}`;
    await sendEmail(req.body.email,"Verify email",url)
    console.log(user)
    const savedUser = await user.save();
    const token = generateToken(savedUser);
    res.status(201).json(token)
})
router.post('/login', async (req, res) => {
     try{
        const {value} = loginSchema.validate(req.body)
        console.log(value.name)
    
    const user = await  User.findOne({email: value.email})
    
    if(!user){
        return res.status(401).json("User not found")
    }
    if(!user.verified){ 
        let uniqueString = randomString();
        const url = `${process.env.BASE_URL}/verify/${uniqueString}`;
        await sendEmail(value.email,"Verify email",url)
        res.status(401).json('User not verified')
    }
    const match = await bcrypt.compare(value.password,user.password)
    
    if(!match){
      return  res.status(400).json("Wrong credentials")
    }
    const token = generateToken(user);
    res.status(200).json(token)
    }catch(error){
        if(error.isJoi()) res.status(400).json({message: error})
    }
    
})
router.get('/verify/:uniqueString', async (req, res) => {
    const {uniqueString} = req.params
    const user = await User.findOne({uniqueString:uniqueString})
    if(user){
        user.verified = true
        await user.save()
        res.status(200).json('User verified')
    }else{
        res.status(400).json("Verification failed")
    }

})

module.exports = router 