const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel');

const validateEmail = (email) => {
  return (email).trim().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

//------------------------------------------------------------------------------------------------------------------//

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "1034407899073-9g0d06qvpfofhkq164e3as0bnavcb1qv.apps.googleusercontent.com", // Your Credentials here.
    clientSecret: "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", // Your Credentials here.
    callbackURL: "http://localhost:3000/auth/callback/1",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));



//.............................................PHASE (1) Create user........................................................


const createuser = async (req, res) => {
  try {

  


    const data = req.body;
     if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Please Enter Some Details" });
    } 

    if (!data.title) {
      return res.status(400).send({ status: false, message: "Title is missing" });
    }

    let validTitle = ['Mr', 'Mrs', 'Miss'];
    if (!validTitle.includes(data.title.trim())) return res.status(400).send({ status: false, message: "Title should be one of Mr, Mrs, Miss" });

    if (!data.name) {
      return res.status(400).send({ status: false, message: "Name is missing" });
    }

   

    let validString = /\d/;
    if (validString.test(data.name.trim())) return res.status(400).send({ status: false, message: "Name must be valid it should not contains numbers" });

   

    if (!data.email) {
      return res.status(400).send({ status: false, message: "Email is missing" });
    }

    if (!validateEmail(data.email)) {
      return res.status(400).send({ status: false, message: "Invaild E-mail id." });
    }

   

    const findemail = await userModel.findOne({ email: data.email }); //email exist or not

    if (findemail) {
      return res.status(400).send({ status: false, message: `${data.email} Email Id  Already Registered.Please,Give Another ID` })
    }

    
    

    const user = await userModel.create(data);
    return res.status(201).send({ status: true, message: "Success", data:user });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};



const login = async (req, res) => {
  try {
      let profile = req.user;
      if (!req.user)
          return res.redirect('api/auth');

      let userData = {
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos,
          token: profile.id
      }

      let isPresent = await userModel.findOne({ email: profile.emails[0].value })

      if (isPresent) return res.status(200).json({ success: true, data: isPresent, message: "login successfull" })

      let document = await userModel.create(userData)
      return res.status(200).json({ success: true, data: document, message: "login successfull" })

  } catch (err) {
      res.status(500).json({ message: err.message })
  }
}



module.exports={createuser,login} 
