const express = require('express');
const router = express.Router();

const passport = require('passport');

const {createuser,login}=require('../controllers/userController')
const{createBook,getbooks,addToList} = require('../controllers/bookController')

//-------------------------------------------------------------------------------------------------//
router.get('/', (req, res) => {
    res.send("<button><a href='/auth'>Login With Google</a></button>")
});
router.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile' ]
}));

router.get("/auth/callback", passport.authenticate( 'google', {
    successRedirect: '/api/auth/callback/success',
    failureRedirect: 'api/auth/callback/failure'
}))
router.get('/auth/callback/success' ,login );
router.get('/api/auth/callback/failure', (req,res) =>{
    res.status(500).send({error:"log in error ,please try again"})
})





const isAuthenticated = (req, res,next) =>{

   try{ console.log(req.isAuthenticated())
    if(req.isAuthenticated()) { return next() }
    else res.redirect('/api')
}catch(err){
    res.status(500).json({message:err.message})
}
}

//--------------------------------------------------------------------------------//
router.post('/register',createuser)
router.post('/login',login)

 router.post('/addbook',createBook)


router.get('/books',getbooks);

router.post('/list/:id',addToList);


module.exports =router