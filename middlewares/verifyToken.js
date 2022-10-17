const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;


    if(authHeader) {
        
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                req.user =  user;
                
                next()
            } catch (err) {
                res.status(500).json('Invalid/Expired token');
                console.log(token)
               console.log('invalid')
            }
        }else{
            res.status(501).json("Authentification token must be\'Bearer [token]")
        }

    }else{
        
        res.status(501).json('Authentification header must be provided')
    }
    
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req,res,()=>{
        if(req.user.role === 'user' || req.user.role === 'admin' || req.user.role === 'review'){
            console.log('verified')
           next();
        }else{
             res.status(403).json("Unauthorized action")
        }
       
    })
}
const verifyAdmin = (req,res,next) => {
    verifyToken(req,res,()=>{
        if(req.user.role === 'admin'){
        next()
    }else{
        res.status(401).json("Admin access only")
    }
    }) 
}
const verifyCommittee = (req,res,next) => {
    verifyToken(req,res,()=>{
       if(req.user.role === 'review' || req.user.role === 'admin'){
        console.log('verified')
        next()
    }else{
        res.status(401).json("Admin access only")
    } 
    })
}

module.exports = {verifyToken,verifyTokenAndAuthorization,verifyAdmin,verifyCommittee}