const router = require("express").Router()
const Doc = require('../models/Doc')
const {verifyTokenAndAuthorization, verifyCommittee} = require('../middlewares/verifyToken')
const upload = require('../utils/upload')
const fs = require('fs')



//CREATE DOC
router.post('/',verifyTokenAndAuthorization,upload.single('file'), async (req, res) => {
   console.log(req.file,'create')
   const doc = await Doc.find({userId: req.user.id})
    if(!doc){
     const doc = new Doc({
        userId: req.user.id,
        documents: [{name:req.body.name , file: fs.readFileSync("uploads/" + req.file.filename)}],

     })
     const savedDoc = await doc.save()
     res.status(201).json(savedDoc)
    }
})
//GET DOC
router.get('/',verifyTokenAndAuthorization, async (req, res)=>{
    console.log('get doc')
    try{
        const doc = await Doc.find( {userId: req.user.id}).sort({createdAt: -1})
        if(doc){
            res.status(200).json(doc)
        }
    }catch(err){
       res.status(500).json({message: err})
    }
   
})
//GET DOCS
router.get('/review',verifyCommittee, async (req, res)=> {
    try{
        const doc = await Doc.find().sort({createdAt: -1})
        
        if(doc){
            console.log('found')
            res.status(200).json(doc)
        }
    }catch(err){
       res.status(500).json({message: err})
    }
})
//UPDATE DOC
router.put('/:id',verifyTokenAndAuthorization,upload.single('file'), async (req, res) => {
    console.log(req.file,'req.file',req.params.id)
    if(req.file) {
        
        try{
           // const newDoc = {name: req.body.name, file: req.file.filename}
        
             const doc = await Doc.find({userId: req.user.id})
            const docIndex = doc[0].documents.findIndex(d => d.id === req.params.id)
             console.log(docIndex)
             console.log(doc[0].documents[docIndex])
             doc[0].documents[docIndex].file = fs.readFileSync("uploads/" + req.file.filename)
             const savedDoc = await doc[0].save()
          console.log(savedDoc.documents[docIndex])
             res.status(200).json(savedDoc)
        }catch(error){
           res.status(400).json(error)
        }
       
    }
})
//ADD DOC 
router.patch('/',verifyTokenAndAuthorization, upload.single('file'), async (req, res)=>{
    try{
        const doc = await Doc.find({userId: req.user.id})
        if(doc){
            const newDoc = {name:req.body.name, file: fs.readFileSync("uploads/" + req.file.filename), }
            doc[0].documents.unshift(newDoc)
            const savedDoc = await doc[0].save()  
            res.status(200).json(savedDoc)
        }
    }catch (err){
       res.status(500).json(err)
    }
})

//DELETE SINGLE FILE
router.delete('/single/:id',verifyTokenAndAuthorization, async function(req, res){
    const doc = await Doc.find({userId: req.user.id})
    if(doc){
        try{
        const docIndex =  doc[0].documents.findIndex(d => d.id === req.params.id)
        doc[0].documents.splice(docIndex, 1)
           const savedDoc =  await doc[0].save()
           res.status(200).json(savedDoc)
        }catch(error){
            res.status(500).json(error)
        }
    }
})
//DELETE DOC
router.delete('/:id',verifyTokenAndAuthorization, async (req, res)=>{
    console.log(req.params.id)
    try {
        await Doc.findByIdAndDelete(req.params.id);
        res.status(200).json("Doc has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
})

module.exports = router