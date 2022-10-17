const router = require('express').Router()
const Doc = require('../models/Doc')
const {verifyTokenAndAuthorization, verifyCommittee} = require('../middlewares/verifyToken')

//RETURN DOC TO USER WITH COMMENTS
router.patch('/:id',verifyCommittee, async (req, res) => {
    const {comments} = req.body
    console.log(comments,11,req.body)
    if(comments){
       try{
        const doc = await Doc.findById(req.params.id)
        
        doc.comments.push({body: comments})
        console.log(doc.comments)
        const savedDoc = await doc.save()
        res.status(200).json(savedDoc)
       }catch(error){
        console.log(error)
        res.status(500).json(error)
       }
    }
})
router.delete('/id',verifyCommittee, async (req,res) => {
    console.log(req.query.docId, req.query.commentId)
    try{
        const doc = await Doc.findById(req.query.docId)
        const commentIndex = doc.comments.findIndex((c)=> c.id === req.query.commentId)
        doc.comments.splice(commentIndex, 1)
        const savedDoc = await doc.save()
        res.status(200).json(savedDoc)
       }catch(error){
        console.log(error)
        res.status(500).json(error)
       }
})
module.exports = router;