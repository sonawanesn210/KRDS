const express = require("express");
const mongoose = require("mongoose")
const app = express();

const route = require("./routes/route.js")


const passport = require('passport');
const session = require('express-session')
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb+srv://Uranium-Batch:aruSjkdGdfhc9MRK@functionup.eel5r.mongodb.net/KRDS", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use(express.json());
app.use(express.urlencoded({extended:true}))
//app.use(cors())


 app.use("/", route)

 app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})