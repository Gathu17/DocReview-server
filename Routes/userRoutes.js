const router = require("express").Router()
const User = require('../models/User')
const {verifyTokenAndAuthorization,verifyAdmin, verifyCommittee} = require('../middlewares/verifyToken')
const bcrypt = require('bcryptjs')

//UPDATE
router.patch("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
     return res.status(400).json("Please provide both passwords")
    }
    const user = await User.findById(req.params.id)
    console.log(user.password)

  const match =  await bcrypt.compare(oldPassword, user.password)
  
  console.log(match)
  if(!match){
   return res.status(401).json("Password mismatch")
  }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          password: newPassword,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //DELETE
  router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET USER
  router.get("/find/:id", verifyCommittee, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET USERS
  router.get("/", verifyAdmin, async (req, res) => {
    try {
      const users =  await User.find().sort({ _id: -1 })
        
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router